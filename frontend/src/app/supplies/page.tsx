"use client";
import React, { useMemo, useReducer, useEffect } from "react";

// ===== Types =====
export type Priority = "high" | "medium" | "low";
export type Category = "医薬品" | "衛生" | "食料" | "生活用品";

export interface Product {
  id: string;
  name: string;
  unit: string;              // 例: 本, 食, パック, 枚, 缶, 箱, ケース
  weightGrams: number;       // 1単位あたり重量(g) — 水は ≒ mL とみなす
  recommendedPerPersonPerDay?: number; // 推奨/人/日（例: ごはん0.2箱など）
  imageUrl?: string;         // 商品画像
  imageVerified?: boolean;   // 画像の正確性が検証済みかどうか
  category: Category;
}

export interface NeedRow {
  id: string;         // UI用行ID
  productId: string;  // CATALOG/props.products から選択
  quantity: number;   // 自由入力
  priority: Priority; // 緊急度
  notes?: string;
}

// === バックエンドが扱いやすい拡張ペイロード ===
export interface NeedsListPayload {
  evacueeCount: number;
  targetDays: number;
  items: Array<{
    // 基本
    id: string;                 // 行ID（参照用）
    productId: string;
    productName: string;
    unit: string;
    category: Category;
    quantity: number;
    priority: Priority;
    notes?: string;

    // 重量
    perUnitWeightGrams: number; // 単位重量
    totalWeightGrams: number;   // 行合計重量

    // ドローン（後方互換: droneEligible は全量一括の可否）
    droneEligible: boolean;           // = droneEligibleWholeOrder（互換フィールド）
    droneEligibleWholeOrder: boolean; // 全量を1フライトで運べるか
    dronePerUnitEligible: boolean;    // 1単位が積載上限以下か（分割搬送の可否）
    droneUnitsPerFlight: number | null;   // 1フライトで運べる単位数（分割前提）
    droneFlightsRequired: number | null;  // 全量を運ぶのに必要なフライト数（分割前提）
  }>;

  // 集計 & グルーピング
  analytics: {
    totals: { units: number; weightGrams: number; waterCases: number };
    byPriority: Record<Priority, {
      lineCount: number;
      units: number;
      weightGrams: number;
      itemIds: string[]; // rowsのid
    }>;
    drone: {
      payloadLimitGrams: number;
      wholeOrderEligibleIds: string[];
      wholeOrderIneligibleIds: string[];
      flights: Array<{
        id: string;                 // 行ID
        productId: string;
        unitsPerFlight: number | null;
        flightsRequired: number | null;
      }>;
    };
  };
}

// ===== Theme =====
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";

// ===== Config =====
const DRONE_MAX_PAYLOAD_G = 2000;         // 1回あたりの目安
const WATER_L_PER_PERSON_PER_DAY = 3;     // 水の基準（2〜3L推奨）
const ML_PER_L = 1000;

// ===== Helpers =====
function toSafeNumber(v: any, def = 0, min?: number) {
  const n = typeof v === "number" ? v : Number(v);
  const f = Number.isFinite(n) ? n : def;
  return typeof min === "number" ? Math.max(min, f) : f;
}
function gid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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

function isDroneEligibleWholeOrder(p: Product | undefined, quantity: number) {
  if (!p) return false;
  return p.weightGrams * Math.max(0, quantity) <= DRONE_MAX_PAYLOAD_G;
}
function dronePlanForItem(p: Product | undefined, quantity: number) {
  if (!p || p.weightGrams <= 0) {
    return {
      perUnitEligible: false,
      unitsPerFlight: null as number | null,
      flightsRequired: null as number | null,
    };
  }
  const perUnit = p.weightGrams;
  const perUnitEligible = perUnit <= DRONE_MAX_PAYLOAD_G;
  if (!perUnitEligible) {
    return { perUnitEligible, unitsPerFlight: null, flightsRequired: null };
  }
  const unitsPerFlight = Math.max(1, Math.floor(DRONE_MAX_PAYLOAD_G / perUnit));
  const flightsRequired = Math.ceil(Math.max(0, quantity) / unitsPerFlight);
  return { perUnitEligible, unitsPerFlight, flightsRequired };
}

// ===== Default Catalog =====
const DEFAULT_CATALOG: Product[] = [
  // === 食料・水 ===
  { id: "p-water-2l",     name: "飲料水 2L×6本（1ケース）", unit: "ケース", weightGrams: 12000, category: "食料", imageVerified: false },
  { id: "p-instant-rice", name: "サトウのごはん 200g×5食",   unit: "箱",    weightGrams: 1000,  recommendedPerPersonPerDay: 0.2, category: "食料", imageVerified: false },
  { id: "p-canned-food",  name: "缶詰(主食) 1缶",            unit: "缶",    weightGrams: 350,   recommendedPerPersonPerDay: 1,   category: "食料", imageVerified: false },

  // === 生活用品・衛生 ===
  { id: "p-blanket",      name: "毛布",                      unit: "枚",    weightGrams: 800,   category: "生活用品", imageVerified: false },
  { id: "p-battery-aa",   name: "単3電池(8本)",              unit: "パック", weightGrams: 180,  category: "生活用品", imageVerified: false },
  { id: "p-mask",         name: "不織布マスク(50枚)",        unit: "箱",    weightGrams: 200,   recommendedPerPersonPerDay: 0.5, category: "衛生", imageVerified: false },

  // === 医薬品 ===
  { id: "m-acetaminophen", name: "解熱鎮痛剤（アセトアミノフェン）20錠", unit: "箱", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-ibuprofen",     name: "解熱鎮痛剤（イブプロフェン）24錠",     unit: "箱", weightGrams: 28,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-cold-combo",    name: "総合感冒薬（風邪薬）30錠",             unit: "箱", weightGrams: 40,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-antihistamine", name: "抗ヒスタミン薬（アレルギー薬）10錠",   unit: "箱", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-anti-diarrhea", name: "下痢止め（ロペラミド等）12錠",         unit: "箱", weightGrams: 18,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-ors-500",       name: "経口補水液 500mL（1本）",               unit: "本", weightGrams: 500, recommendedPerPersonPerDay: 0.5, category: "医薬品", imageVerified: false },
  { id: "m-povidone",      name: "消毒液（ポビドンヨード）100mL",        unit: "本", weightGrams: 120, recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-sterile-gauze", name: "滅菌ガーゼ 10枚入",                     unit: "袋", weightGrams: 50,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-bandage-roll",  name: "包帯 5cm×5m",                           unit: "巻", weightGrams: 30,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-surgical-tape", name: "サージカルテープ 12mm×9m",              unit: "巻", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-bandaids",      name: "ばんそうこう（アソート20枚）",           unit: "箱", weightGrams: 80,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-thermometer",   name: "体温計",                                   unit: "本", weightGrams: 50,  recommendedPerPersonPerDay: 0.005, category: "医薬品", imageVerified: false },
  { id: "m-eyedrops",      name: "目薬（人工涙液）",                        unit: "本", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-cough-syrup",   name: "咳止めシロップ 120mL",                    unit: "本", weightGrams: 160, recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-throat-candy",  name: "のど飴",                                   unit: "袋", weightGrams: 80,  recommendedPerPersonPerDay: 0.05, category: "医薬品", imageVerified: false },
];

// ===== State Management =====
type SuppliesState = {
  evacueeCount: number;
  targetDays: number;
  rows: NeedRow[];
  saving: boolean;
  imageStates: Record<string, {
    src: string | null;
    candidates: string[];
    open: boolean;
  }>;
};

type SuppliesAction = 
  | { type: 'SET_EVACUEE_COUNT'; payload: number }
  | { type: 'SET_TARGET_DAYS'; payload: number }
  | { type: 'SET_ROWS'; payload: NeedRow[] }
  | { type: 'UPDATE_ROW'; payload: { id: string; updates: Partial<NeedRow> } }
  | { type: 'ADD_ROW'; payload: NeedRow }
  | { type: 'REMOVE_ROW'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_IMAGE_STATE'; payload: { productId: string; updates: Partial<SuppliesState['imageStates'][string]> } };

const suppliesReducer = (state: SuppliesState, action: SuppliesAction): SuppliesState => {
  switch (action.type) {
    case 'SET_EVACUEE_COUNT':
      return { ...state, evacueeCount: action.payload };
    case 'SET_TARGET_DAYS':
      return { ...state, targetDays: action.payload };
    case 'SET_ROWS':
      return { ...state, rows: action.payload };
    case 'UPDATE_ROW':
      return {
        ...state,
        rows: state.rows.map(row => 
          row.id === action.payload.id 
            ? { ...row, ...action.payload.updates }
            : row
        )
      };
    case 'ADD_ROW':
      return { ...state, rows: [...state.rows, action.payload] };
    case 'REMOVE_ROW':
      return { ...state, rows: state.rows.filter(row => row.id !== action.payload) };
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    case 'SET_IMAGE_STATE':
      return {
        ...state,
        imageStates: {
          ...state.imageStates,
          [action.payload.productId]: {
            ...state.imageStates[action.payload.productId],
            ...action.payload.updates
          }
        }
      };
    default:
      return state;
  }
};

// ===== Component =====
export default function NeedsListForm({
  products,
  initialEvacueeCount = 100,
  initialTargetDays = 3,
  onSubmit,
  enforceVerifiedImages = false,
}: {
  products?: Product[];
  initialEvacueeCount?: number;
  initialTargetDays?: number;
  onSubmit?: (payload: NeedsListPayload) => void;
  enforceVerifiedImages?: boolean;
}) {
  const catalog = products && products.length > 0 ? products : DEFAULT_CATALOG;

  const [state, dispatch] = useReducer(suppliesReducer, {
    evacueeCount: initialEvacueeCount,
    targetDays: initialTargetDays,
    rows: [{ id: gid(), productId: catalog[0]?.id ?? "", quantity: 1, priority: "medium", notes: "" }],
    saving: false,
    imageStates: {}
  });

  const productMap = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);
  const grouped = useMemo(() => {
    const g = new Map<Category, Product[]>();
    catalog.forEach((p) => {
      if (!g.has(p.category)) g.set(p.category, []);
      g.get(p.category)!.push(p);
    });
    g.forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name, "ja")));
    return g;
  }, [catalog]);

  // ==== 重複選択禁止 ====
  const selectedIds = useMemo(() => new Set(state.rows.map(r => r.productId).filter(Boolean)), [state.rows]);

  // 初期 & 変更時：重複があれば空き商品に差し替え（必要時のみ dispatch）
  useEffect(() => {
    const seen = new Set<string>();
    let changed = false;
    const nextRows = state.rows.map((r) => {
      if (!r.productId || seen.has(r.productId)) {
        const candidate = catalog.find(p => !seen.has(p.id));
        if (candidate) {
          seen.add(candidate.id);
          changed = true;
          return { ...r, productId: candidate.id };
        }
      } else {
        seen.add(r.productId);
      }
      return r;
    });
    if (changed) dispatch({ type: 'SET_ROWS', payload: nextRows });
  }, [catalog, state.rows]);

  function safeChangeProduct(rowId: string, newId: string) {
    const usedByOther = state.rows.some(rr => rr.id !== rowId && rr.productId === newId);
    if (usedByOther) {
      alert("この商品は既に他の行で選択されています。");
      return;
    }
    dispatch({ type: 'UPDATE_ROW', payload: { id: rowId, updates: { productId: newId } } });
  }

  // 優先度順ソート（表示用）
  const sortedRows = useMemo(() => {
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return [...state.rows].sort((a, b) => rank[a.priority] - rank[b.priority]);
  }, [state.rows]);

  // サマリー
  const totals = useMemo(() => {
    let units = 0, weight = 0, waterCases = 0;
    state.rows.forEach(r => {
      const p = productMap.get(r.productId);
      if (!p) return;
      units += Number(r.quantity) || 0;
      weight += p.weightGrams * (Number(r.quantity) || 0);
      if (p.id === "p-water-2l") waterCases += Number(r.quantity) || 0;
    });
    return {
      units,
      weightKg: Math.round(weight) / 1000,
      waterCases, // UIでは使わないが payload.analytics で利用
    };
  }, [state.rows, productMap]);

  function updateRow<T extends keyof NeedRow>(id: string, key: T, value: NeedRow[T]) {
    dispatch({ type: 'UPDATE_ROW', payload: { id, updates: { [key]: value } } });
  }

  function addRow() {
    const used = new Set(state.rows.map(r => r.productId));
    const next = catalog.find(p => !used.has(p.id));
    if (!next) {
      alert("追加できる商品がありません（全商品が選択済み）");
      return;
    }
    dispatch({ type: 'ADD_ROW', payload: { id: gid(), productId: next.id, quantity: 1, priority: "medium", notes: "" } });
  }

  function removeRow(id: string) {
    if (state.rows.length > 1) {
      dispatch({ type: 'REMOVE_ROW', payload: id });
    }
  }

  function applyRecommendAll() {
    const updatedRows = state.rows.map(r => {
      const p = productMap.get(r.productId);
      const rec = calcRecommended(p, state.evacueeCount, state.targetDays);
      return rec != null ? { ...r, quantity: rec } : r;
    });
    dispatch({ type: 'SET_ROWS', payload: updatedRows });
  }

  function handleSave() {
    // バリデーション
    const cleaned = state.rows.map((r) => ({
      ...r,
      quantity: toSafeNumber(r.quantity, 1, 0),
      notes: (r.notes ?? "").trim() || undefined,
    }));
    const invalid = cleaned.find((r) => !productMap.get(r.productId) || r.quantity <= 0);
    if (invalid) {
      alert("各行の『品目』と『数量(>0)』を確認してください");
      return;
    }

    // 明細の拡張（重量・ドローン情報付与）
    const detailedItems = cleaned.map((r) => {
      const p = productMap.get(r.productId)!;
      const perUnitWeightGrams = p.weightGrams;
      const totalWeightGrams = perUnitWeightGrams * r.quantity;

      const wholeOrder = isDroneEligibleWholeOrder(p, r.quantity);
      const plan = dronePlanForItem(p, r.quantity);

      return {
        id: r.id,
        productId: r.productId,
        productName: p.name,
        unit: p.unit,
        category: p.category,
        quantity: r.quantity,
        priority: r.priority,
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
      high: { ...initAgg }, medium: { ...initAgg }, low: { ...initAgg },
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
          payloadLimitGrams: DRONE_MAX_PAYLOAD_G,
          wholeOrderEligibleIds,
          wholeOrderIneligibleIds,
          flights,
        },
      },
    };

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      onSubmit ? onSubmit(payload) : console.log("NeedsListPayload", payload);
      alert("必要物資リストを作成しました（コンソールにも出力しています）");
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pb-24">{/* pbで固定バー分の余白 */}
      {/* ヒーロー */}
      <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">必要物資リスト</h1>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="font-medium">避難人数</span>
            <input
              type="number"
              min={0}
              className="rounded-xl border px-3 py-3"
              value={state.evacueeCount}
              onChange={(e) => dispatch({ type: 'SET_EVACUEE_COUNT', payload: toSafeNumber(e.target.value, state.evacueeCount, 0) })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">対象日数</span>
            <input
              type="number"
              min={1}
              className="rounded-xl border px-3 py-3"
              value={state.targetDays}
              onChange={(e) => dispatch({ type: 'SET_TARGET_DAYS', payload: toSafeNumber(e.target.value, state.targetDays, 1) })}
            />
          </label>
          <div className="flex items-end text-gray-600 leading-tight text-sm">
            <p className="break-keep">
              水は {WATER_L_PER_PERSON_PER_DAY}L/人/日で自動換算（ケース単位で切り上げ）。他はカタログ目安。
            </p>
          </div>
        </div>
      </div>

      {/* カードグリッド */}
      <section className="mx-auto max-w-screen-xl px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRows.map((r) => {
            const prod = productMap.get(r.productId);
            const rec = calcRecommended(prod, state.evacueeCount, state.targetDays);
            return (
              <article
                key={r.id}
                className="rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
              >
                {/* 画像：フルブリード＋優先度チップ */}
                <div className="relative">
                  <ProductHeroImage 
                    product={prod} 
                    enforceVerified={enforceVerifiedImages}
                    imageState={state.imageStates[prod?.id ?? '']}
                    onImageStateChange={(updates) => 
                      dispatch({ type: 'SET_IMAGE_STATE', payload: { productId: prod?.id ?? '', updates } })
                    }
                  />
                  <div className="absolute left-3 top-3">
                    <PriorityChip priority={r.priority} />
                  </div>
                </div>

                {/* 本体 */}
                <div className="p-5 space-y-4">
                  {/* 商品セレクト（重複はdisabled） */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">商品</label>
                    <select
                      className="w-full rounded-xl border px-3 py-3"
                      value={r.productId}
                      onChange={(e) => safeChangeProduct(r.id, e.target.value)}
                      aria-label="商品を選択"
                    >
                      {Array.from(grouped.entries()).map(([cat, list]) => (
                        <optgroup key={cat} label={cat}>
                          {list.map((p) => {
                            const isUsedElsewhere = selectedIds.has(p.id) && r.productId !== p.id;
                            return (
                              <option key={p.id} value={p.id} disabled={isUsedElsewhere}>
                                {p.name}{isUsedElsewhere ? "（選択済み）" : ""}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* 数量＋おすすめ */}
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">数量</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          step={prod?.id === "p-water-2l" ? 1 : 0.5} // 水はケース単位で安全に
                          className="w-full rounded-xl border px-3 py-3 text-right"
                          value={r.quantity}
                          onChange={(e) => updateRow(r.id, "quantity", toSafeNumber(e.target.value, r.quantity, 0))}
                          aria-label="数量"
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">{prod?.unit ?? "—"}</span>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">おすすめ</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800 whitespace-nowrap">
                          {rec ?? "—"}{rec != null && ` ${prod?.unit ?? ""}`}
                        </span>
                        <button
                          type="button"
                          disabled={rec == null}
                          onClick={() => rec != null && updateRow(r.id, "quantity", rec)}
                          className="rounded-lg px-3 py-2 text-white disabled:opacity-50 whitespace-nowrap"
                          style={{ backgroundColor: RAKUTEN_RED }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                          title="おすすめ数を数量に反映"
                        >
                          反映
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 優先度＋備考 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">優先度</label>
                      <select
                        className="w-full rounded-xl border px-3 py-3"
                        value={r.priority}
                        onChange={(e) => updateRow(r.id, "priority", e.target.value as Priority)}
                        aria-label="優先度"
                      >
                        <option value="high">高</option>
                        <option value="medium">中</option>
                        <option value="low">低</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">備考</label>
                      <input
                        className="w-full rounded-xl border px-3 py-3"
                        placeholder="任意"
                        value={r.notes ?? ""}
                        onChange={(e) => updateRow(r.id, "notes", e.target.value)}
                        aria-label="備考"
                      />
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="pt-2">
                    <button
                      onClick={() => removeRow(r.id)}
                      className="rounded-xl px-4 py-2 text-white whitespace-nowrap"
                      style={{ backgroundColor: RAKUTEN_RED }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                      title="行を削除"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 追加ボタン */}
        <div className="mt-8">
          <button
            onClick={addRow}
            className="rounded-xl px-5 py-3 text-white whitespace-nowrap"
            style={{ backgroundColor: RAKUTEN_RED }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
          >
            ＋ 行を追加
          </button>
        </div>
      </section>

      {/* ===== 固定サマリーバー（合計 & 保存） ===== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur border-t">
        <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            合計 <b>{totals.units}</b> 単位 / 総重量 <b>{totals.weightKg.toFixed(1)}</b> kg
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={applyRecommendAll}
              className="rounded-xl px-4 py-2 text-gray-800 border hover:bg-gray-50 whitespace-nowrap"
              title="全行におすすめ数量を適用"
            >
              全行におすすめ反映
            </button>
            <button
              onClick={handleSave}
              disabled={state.saving}
              className="rounded-xl px-5 py-2.5 text-white disabled:opacity-50 whitespace-nowrap"
              style={{ backgroundColor: RAKUTEN_RED }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
            >
              {state.saving ? "保存中…" : "保存"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== UI: Priority Chip =====
function PriorityChip({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; cls: string }> = {
    high:   { label: "高", cls: "bg-red-100 text-red-700 ring-red-200" },
    medium: { label: "中", cls: "bg-amber-100 text-amber-700 ring-amber-200" },
    low:    { label: "低", cls: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  };
  const v = map[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${v.cls}`}>
      優先度：{v.label}
    </span>
  );
}

// ===== UI: Product Hero Image（クリック拡大：ライトボックス） =====
function ProductHeroImage({ 
  product, 
  enforceVerified, 
  imageState,
  onImageStateChange
}: { 
  product?: Product; 
  enforceVerified?: boolean;
  imageState?: { src: string | null; candidates: string[]; open: boolean };
  onImageStateChange: (updates: Partial<{ src: string | null; candidates: string[]; open: boolean }>) => void;
}) {
  // policy: 検証厳格なら DBの imageUrl が未検証のときは表示しない
  const allowByPolicy =
    !product ? false :
    !enforceVerified || product.imageVerified || !product.imageUrl;

  useEffect(() => {
    if (!product || !allowByPolicy) { 
      onImageStateChange({ src: null, candidates: [] }); 
      return; 
    }

    const given = product.imageUrl ? [product.imageUrl] : [];
    const id = product.id;
    const fallbacks = ["/products", "/images"].flatMap((base) =>
      [".jpg", ".png", ".webp"].map((ext) => `${base}/${id}${ext}`)
    );
    const list = [...given, ...fallbacks];
    onImageStateChange({ candidates: list, src: list[0] ?? null });
  }, [product, allowByPolicy, onImageStateChange]);

  const onError = () => {
    const currentCandidates = imageState?.candidates ?? [];
    const next = currentCandidates.slice(1);
    onImageStateChange({ candidates: next, src: next[0] ?? null });
  };

  const currentSrc = imageState?.src;
  const currentOpen = imageState?.open ?? false;

  // 画像なし時はグラデ背景プレースホルダ
  if (!product || !allowByPolicy || !currentSrc) {
    return (
      <div className="w-full h-56 sm:h-64 lg:h-72 rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <CategoryIcon category={product?.category ?? "生活用品"} size="xl" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-56 sm:h-64 lg:h-72 rounded-t-3xl overflow-hidden">
        <img
          src={currentSrc}
          alt={product.name}
          className="h-full w-full object-contain cursor-zoom-in"
          onError={onError}
          onClick={() => onImageStateChange({ open: true })}
        />
      </div>
      {currentOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center"
          onClick={() => onImageStateChange({ open: false })}
        >
          <img
            src={currentSrc}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
          />
        </div>
      )}
    </>
  );
}

// ===== UI: Category Icon (SVG) =====
function CategoryIcon({ category, size = "lg" }: { category: Category; size?: "md" | "lg" | "xl" }) {
  const s = size === "xl" ? "h-20 w-20" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  switch (category) {
    case "医薬品":
      return (
        <svg viewBox="0 0 24 24" className={s} role="img" aria-label="医薬品">
          <path d="M7 10h10v2H7z" fill="#666"/>
          <rect x="6" y="6" width="12" height="8" rx="2" fill="#a8a8a8"/>
          <rect x="8" y="14" width="8" height="6" rx="2" fill="#e5e7eb"/>
        </svg>
      );
    case "衛生":
      return (
        <svg viewBox="0 0 24 24" className={s} role="img" aria-label="衛生">
          <circle cx="12" cy="8" r="3" fill="#a8a8a8"/>
          <rect x="9" y="11" width="6" height="7" rx="2" fill="#e5e7eb"/>
        </svg>
      );
    case "食料":
      return (
        <svg viewBox="0 0 24 24" className={s} role="img" aria-label="食料">
          <path d="M5 12h14v6H5z" fill="#e5e7eb"/>
          <rect x="7" y="6" width="10" height="6" rx="1" fill="#a8a8a8"/>
        </svg>
      );
    case "生活用品":
    default:
      return (
        <svg viewBox="0 0 24 24" className={s} role="img" aria-label="生活用品">
          <rect x="6" y="6" width="12" height="12" rx="2" fill="#e5e7eb"/>
          <path d="M8 10h8v2H8z" fill="#a8a8a8"/>
        </svg>
      );
  }
}
