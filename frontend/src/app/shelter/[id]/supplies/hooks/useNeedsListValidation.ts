import { useCallback } from "react";
import { Product, NeedRow, NeedsListPayload, SuppliesState } from "../types";
import { WATER_L_PER_PERSON_PER_DAY, ML_PER_L } from "../constants";

// ===== Helpers =====
function toSafeNumber(v: unknown, def = 0, min?: number) {
  const n = typeof v === "number" ? v : Number(v);
  const f = Number.isFinite(n) ? n : def;
  return typeof min === "number" ? Math.max(min, f) : f;
}

// 共通おすすめ計算 + 水(p-water-2l)は3L/人/日をケースに換算し切り上げ
function calcRecommended(p: Product | undefined, evacueeCount: number, targetDays: number) {
  if (!p) return undefined;

  if (p.id === "p-water-2l") {
    const totalMl =
      WATER_L_PER_PERSON_PER_DAY *
      ML_PER_L *
      Math.max(0, evacueeCount) *
      Math.max(1, targetDays);
    const perUnitMl = p.weightGrams; // 水は 1g ≒ 1mL、ケース重量(12L=12000mL)
    if (perUnitMl <= 0) return undefined;
    return Math.ceil(totalMl / perUnitMl); // ケース単位で切り上げ
  }

  if (!p.recommendedPerPersonPerDay) return undefined;
  const val = p.recommendedPerPersonPerDay * Math.max(0, evacueeCount) * Math.max(1, targetDays);
  return Math.round(val * 2) / 2; // 0.5刻み
}

function isDroneEligibleWholeOrder(p: Product | undefined, quantity: number, droneMaxPayload: number) {
  if (!p) return false;
  return p.weightGrams * Math.max(0, quantity) <= droneMaxPayload;
}

function dronePlanForItem(p: Product | undefined, quantity: number, droneMaxPayload: number) {
  if (!p || p.weightGrams <= 0) {
    return {
      perUnitEligible: false,
      unitsPerFlight: null as number | null,
      flightsRequired: null as number | null,
    };
  }
  const perUnit = p.weightGrams;
  const perUnitEligible = perUnit <= droneMaxPayload;
  if (!perUnitEligible) {
    return { perUnitEligible, unitsPerFlight: null, flightsRequired: null };
  }
  const unitsPerFlight = Math.max(1, Math.floor(droneMaxPayload / perUnit));
  const flightsRequired = Math.ceil(Math.max(0, quantity) / unitsPerFlight);
  return { perUnitEligible, unitsPerFlight, flightsRequired };
}

export function useNeedsListValidation(productMap: Map<string, Product>, droneMaxPayload: number) {
  const validateAndCreatePayload = useCallback((state: SuppliesState): NeedsListPayload | null => {
    // バリデーション
    const cleaned = state.rows.map((r) => ({
      ...r,
      quantity: toSafeNumber(r.quantity, 1, 0),
      notes: (r.notes ?? "").trim() || undefined,
    }));
    const invalid = cleaned.find((r) => !productMap.get(r.productId) || r.quantity <= 0);
    if (invalid) {
      alert("各行の『品目』と『数量(>0)』を確認してください");
      return null;
    }

    // 明細の拡張（重量・ドローン情報付与）
    const detailedItems = cleaned.map((r) => {
      const p = productMap.get(r.productId)!;
      const perUnitWeightGrams = p.weightGrams;
      const totalWeightGrams = perUnitWeightGrams * r.quantity;

      const wholeOrder = isDroneEligibleWholeOrder(p, r.quantity, droneMaxPayload);
      const plan = dronePlanForItem(p, r.quantity, droneMaxPayload);

      // Priorityの値を大文字に変換（後方互換性のため）
      const normalizedPriority = r.priority.toUpperCase() as Priority;

      return {
        id: r.id,
        productId: r.productId,
        productName: p.name,
        unit: p.unit,
        category: p.category,
        quantity: r.quantity,
        priority: normalizedPriority,
        notes: r.notes,

        perUnitWeightGrams,
        totalWeightGrams,

        // 後方互換＆詳細
        droneEligible: wholeOrder,
        droneEligibleWholeOrder: wholeOrder,
        dronePerUnitEligible: plan.perUnitEligible,
        droneUnitsPerFlight: plan.unitsPerFlight,
        droneFlightsRequired: plan.flightsRequired,
      };
    });

    // 集計 by priority
    const initAgg = { lineCount: 0, units: 0, weightGrams: 0, itemIds: [] as string[] };
    const byPriority: NeedsListPayload["analytics"]["byPriority"] = {
      HIGH: { ...initAgg }, MEDIUM: { ...initAgg }, LOW: { ...initAgg },
    };
    let totalUnits = 0, totalWeightGrams = 0, waterCases = 0;
    const wholeOrderEligibleIds: string[] = [];
    const wholeOrderIneligibleIds: string[] = [];
    const flights: NeedsListPayload["analytics"]["drone"]["flights"] = [];

    for (const it of detailedItems) {
      const agg = byPriority[it.priority];
      agg.lineCount += 1;
      agg.units += it.quantity;
      agg.weightGrams += it.totalWeightGrams;
      agg.itemIds.push(it.id);

      totalUnits += it.quantity;
      totalWeightGrams += it.totalWeightGrams;
      if (it.productId === "p-water-2l") waterCases += it.quantity;

      (it.droneEligibleWholeOrder ? wholeOrderEligibleIds : wholeOrderIneligibleIds).push(it.id);
      flights.push({
        id: it.id,
        productId: it.productId,
        unitsPerFlight: it.droneUnitsPerFlight,
        flightsRequired: it.droneFlightsRequired,
      });
    }

    const payload: NeedsListPayload = {
      evacueeCount: Math.max(0, toSafeNumber(state.evacueeCount, 0)),
      targetDays: Math.max(1, toSafeNumber(state.targetDays, 1)),
      items: detailedItems,
      analytics: {
        totals: { units: totalUnits, weightGrams: totalWeightGrams, waterCases },
        byPriority,
        drone: {
          payloadLimitGrams: droneMaxPayload,
          wholeOrderEligibleIds,
          wholeOrderIneligibleIds,
          flights,
        },
      },
    };

    return payload;
  }, [productMap, droneMaxPayload]);

  return { validateAndCreatePayload };
}
