"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import type { StoredNeeds, Priority, Category } from "@/types/needs";
import Layout from "@/components/Layout";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";
import { getNeedsListsByShelter, getNeedsListById } from "@/lib/api/supplies";

const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";

type SortKey = "category" | "name" | "quantity" | "weight";

// 集計後の1行（品目まとめ）
type GroupedRow = {
  productId: string;
  productName: string;
  unit: string;
  category: Category;
  totalQuantity: number;
  totalWeightGrams: number;
  priorityUnits: Record<Priority, number>;
  dronePerUnitEligible: boolean;
  droneUnitsPerFlight: number | null;
  droneFlightsRequired: number | null;
};

export default function SuppliesStatusPage() {
  const [data, setData] = useState<StoredNeeds | null>(null);
  const params = useParams<{ id: string }>();

  const [q, setQ] = useState(""); // 検索
  const [sortKey, setSortKey] = useState<SortKey>("category");
  const [onlyDroneable, setOnlyDroneable] = useState(false);
  const [catFilter, setCatFilter] = useState<"all" | Category>("all");

  const fetchNeedsFromApi = useCallback(async () => {
    const idStr = params?.id;
    const shelterId = Number(idStr);
    if (!Number.isFinite(shelterId) || shelterId <= 0) {
      setData(null);
      return;
    }

    try {
      const lists = await getNeedsListsByShelter(shelterId);
      if (!lists || lists.length === 0) {
        setData(null);
        return;
      }
      const latest = [...lists].sort((a, b) => {
        const au = a.updatedAt || a.createdAt || "";
        const bu = b.updatedAt || b.createdAt || "";
        return bu.localeCompare(au);
      })[0];
      if (!latest?.id) {
        setData(null);
        return;
      }
      const detail = await getNeedsListById(latest.id);
      const items = (detail.items || []).map((it) => ({
        id: String(it.id ?? `${it.productId}-${Math.random().toString(36).slice(2)}`),
        productId: it.productId,
        productName: it.productName,
        unit: it.unit,
        category: it.category as Category,
        quantity: it.quantity,
        priority: it.priority as Priority,
        notes: it.notes,
        perUnitWeightGrams: it.perUnitWeightGrams,
        totalWeightGrams: it.totalWeightGrams,
        droneEligible: it.droneEligible,
        droneEligibleWholeOrder: it.droneEligibleWholeOrder,
        dronePerUnitEligible: it.dronePerUnitEligible,
        droneUnitsPerFlight: it.droneUnitsPerFlight ?? null,
        droneFlightsRequired: it.droneFlightsRequired ?? null,
      }));

      const totalsUnits = items.reduce((s, r) => s + (Number(r.quantity) || 0), 0);
      const totalsWeight = items.reduce((s, r) => s + (Number(r.totalWeightGrams) || 0), 0);
      const byPriorityInit = { lineCount: 0, units: 0, weightGrams: 0, itemIds: [] as string[] };
      const byPriority: Record<Priority, typeof byPriorityInit> = {
        high: { ...byPriorityInit },
        medium: { ...byPriorityInit },
        low: { ...byPriorityInit },
      };
      for (const it of items) {
        const b = byPriority[it.priority];
        b.lineCount += 1;
        b.units += Number(it.quantity) || 0;
        b.weightGrams += Number(it.totalWeightGrams) || 0;
        b.itemIds.push(it.id);
      }
      const droneWholeOk: string[] = [];
      const droneWholeNg: string[] = [];
      for (const it of items) {
        (it.droneEligibleWholeOrder ? droneWholeOk : droneWholeNg).push(it.id);
      }

      const payload = {
        evacueeCount: detail.evacueeCount,
        targetDays: detail.targetDays,
        items,
        analytics: {
          totals: { units: totalsUnits, weightGrams: totalsWeight, waterCases: detail.waterCases ?? 0 },
          byPriority,
          drone: {
            payloadLimitGrams: 0,
            wholeOrderEligibleIds: droneWholeOk,
            wholeOrderIneligibleIds: droneWholeNg,
            flights: items.map((it) => ({
              id: it.id,
              productId: it.productId,
              unitsPerFlight: it.droneUnitsPerFlight,
              flightsRequired: it.droneFlightsRequired,
            })),
          },
        },
      } satisfies StoredNeeds["payload"];

      setData({ savedAtISO: detail.updatedAt || detail.createdAt || new Date().toISOString(), payload });
    } catch (e) {
      console.error("Failed to load needs from API:", e);
      setData(null);
    }
  }, [params?.id]);

  useEffect(() => {
    fetchNeedsFromApi();
  }, [fetchNeedsFromApi]);

  const payload = data?.payload ?? null;

  // 品目別に集計
  const grouped: GroupedRow[] = useMemo(() => {
    if (!payload) return [];
    const map = new Map<string, GroupedRow>();
    for (const it of payload.items) {
      const key = it.productId;
      let g = map.get(key);
      if (!g) {
        g = {
          productId: it.productId,
          productName: it.productName,
          unit: it.unit,
          category: it.category,
          totalQuantity: 0,
          totalWeightGrams: 0,
          priorityUnits: { high: 0, medium: 0, low: 0 },
          dronePerUnitEligible: it.dronePerUnitEligible,
          droneUnitsPerFlight: it.droneUnitsPerFlight ?? null,
          droneFlightsRequired: null,
        };
        map.set(key, g);
      }
      const qty = Number(it.quantity) || 0;
      g.totalQuantity += qty;
      g.totalWeightGrams += Number(it.totalWeightGrams) || 0;
      g.priorityUnits[it.priority] += qty;

      // 保守的にAND/最小値で統合
      g.dronePerUnitEligible = g.dronePerUnitEligible && it.dronePerUnitEligible;
      if (g.droneUnitsPerFlight && it.droneUnitsPerFlight) {
        g.droneUnitsPerFlight = Math.min(g.droneUnitsPerFlight, it.droneUnitsPerFlight);
      } else {
        g.droneUnitsPerFlight = g.droneUnitsPerFlight ?? it.droneUnitsPerFlight ?? null;
      }
    }

    for (const g of map.values()) {
      if (g.dronePerUnitEligible && g.droneUnitsPerFlight && g.droneUnitsPerFlight > 0) {
        g.droneFlightsRequired = Math.ceil(g.totalQuantity / g.droneUnitsPerFlight);
      } else {
        g.droneFlightsRequired = null;
      }
    }

    return [...map.values()];
  }, [payload]);

  const categories = useMemo(() => {
    const s = new Set<Category>();
    grouped.forEach((g) => s.add(g.category));
    return [...s];
  }, [grouped]);

  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const f = grouped.filter((r) => {
      if (kw && !(r.productName.toLowerCase().includes(kw) || r.category.includes(q as any)))
        return false;
      if (onlyDroneable && !r.dronePerUnitEligible) return false;
      if (catFilter !== "all" && r.category !== catFilter) return false;
      return true;
    });

    const sorted = [...f].sort((a, b) => {
      switch (sortKey) {
        case "quantity":
          return b.totalQuantity - a.totalQuantity || a.productName.localeCompare(b.productName, "ja");
        case "weight":
          return b.totalWeightGrams - a.totalWeightGrams || a.productName.localeCompare(b.productName, "ja");
        case "name":
          return a.productName.localeCompare(b.productName, "ja");
        case "category":
        default:
          return a.category.localeCompare(b.category, "ja") || a.productName.localeCompare(b.productName, "ja");
      }
    });
    return sorted;
  }, [grouped, q, onlyDroneable, catFilter, sortKey]);

  const overview = useMemo(() => {
    if (!payload) return null;
    const totalUnique = grouped.length;
    const totalUnits = grouped.reduce((s, r) => s + r.totalQuantity, 0);
    const totalKg = Math.round(grouped.reduce((s, r) => s + r.totalWeightGrams, 0)) / 1000;
    return {
      evacuees: payload.evacueeCount,
      days: payload.targetDays,
      totalUnique,
      totalUnits,
      totalKg,
    };
  }, [payload, grouped]);

  function downloadCSV() {
    if (!rows.length) return;
    const header = [
      "productId",
      "productName",
      "category",
      "totalQuantity",
      "unit",
      "totalWeightKg",
      "highUnits",
      "mediumUnits",
      "lowUnits",
      "dronePerUnitEligible",
      "droneUnitsPerFlight",
      "droneFlightsRequired"
    ];
    const lines = rows.map((r) => [
      r.productId,
      r.productName,
      r.category,
      r.totalQuantity,
      r.unit,
      (r.totalWeightGrams / 1000).toFixed(1),
      r.priorityUnits.high,
      r.priorityUnits.medium,
      r.priorityUnits.low,
      r.dronePerUnitEligible ? "true" : "false",
      r.droneUnitsPerFlight ?? "",
      r.droneFlightsRequired ?? ""
    ]);
    const csv = [header, ...lines]
      .map(cols =>
        cols.map(c => {
          const s = String(c ?? "");
          return /,|"|\n/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(",")
      ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = data?.savedAtISO?.replace(/[:.]/g, "-") ?? "latest";
    a.download = `supplies-status-by-product-${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadRawJSON() {
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = data?.savedAtISO?.replace(/[:.]/g, "-") ?? "latest";
    a.download = `needs-order-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-24">
        <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-4">
          <div className="mb-6">
            <BackButton fallbackHref={`/shelter/${params?.id}/home`} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">品目別オーダーステータス</h1>
          <p className="text-sm text-gray-600">
            {data
              ? <>最終更新：<b>{new Date(data.savedAtISO).toLocaleString()}</b></>
              : "保存済みの申請データが見つかりません。申請画面で「保存」してください。"}
          </p>

          {/* ツールバー */}
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <input
              className="rounded-xl border px-3 py-3 sm:col-span-2"
              placeholder="品名/カテゴリで検索"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select
              className="rounded-xl border px-3 py-3"
              value={catFilter}
              onChange={(e) => setCatFilter((e.target.value as any) || "all")}
            >
              <option value="all">すべてのカテゴリ</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border px-3 py-3"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="category">カテゴリ → 品名</option>
              <option value="name">品名（五十音順）</option>
              <option value="quantity">数量の多い順</option>
              <option value="weight">重量の重い順</option>
            </select>

            <label className="inline-flex items-center gap-2 text-sm px-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={onlyDroneable}
                onChange={(e) => setOnlyDroneable(e.target.checked)}
              />
              ドローン搬送可能のみ
            </label>
          </div>

          {/* サマリ */}
          {overview && (
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              <SummaryCard title="避難人数" value={`${overview.evacuees} 人`} />
              <SummaryCard title="対象日数" value={`${overview.days} 日`} />
              <SummaryCard title="品目数" value={`${overview.totalUnique} 品目`} />
              <SummaryCard title="合計数量" value={`${overview.totalUnits.toLocaleString()} 単位`} />
              <SummaryCard title="総重量" value={`${overview.totalKg.toFixed(1)} kg`} />
            </div>
          )}

          {/* アクション */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={fetchNeedsFromApi}
              className="rounded-xl px-4 py-2 border hover:bg-gray-50"
            >
              再読み込み
            </button>
            <button
              onClick={downloadCSV}
              className="rounded-xl px-4 py-2 text-white"
              style={{ backgroundColor: RAKUTEN_RED }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
            >
              品目別CSVをダウンロード
            </button>
            <button
              onClick={downloadRawJSON}
              className="rounded-xl px-4 py-2 border hover:bg-gray-50"
            >
              元の詳細JSONをダウンロード
            </button>
          </div>
        </div>

        {/* 品目リスト */}
        <section className="mx-auto max-w-screen-xl px-4 pb-8">
          {!payload ? (
            <EmptyState />
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center text-gray-600">
              条件に一致する品目はありません。
            </div>
          ) : (
            <div className="divide-y rounded-2xl border overflow-hidden bg-white">
              {/* ヘッダ行 */}
              <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
                <div className="col-span-5">品目</div>
                <div className="col-span-2 text-right">数量</div>
                <div className="col-span-2 text-right">総重量</div>
                <div className="col-span-3 text-right">優先度（高/中/低）</div>
              </div>

              {/* データ行 */}
              {rows.map((r) => (
                <div key={r.productId} className="grid grid-cols-12 gap-3 px-4 py-4 items-center">
                  <div className="col-span-5">
                    <div className="font-semibold leading-tight">{r.productName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.category}</div>
                    <div className="mt-2">
                      <DroneBadge
                        perUnit={r.dronePerUnitEligible}
                        unitsPerFlight={r.droneUnitsPerFlight}
                        flights={r.droneFlightsRequired}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="text-lg font-extrabold tabular-nums">
                      {r.totalQuantity.toLocaleString()}{" "}
                      <span className="text-sm font-medium text-gray-500">{r.unit}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="text-lg font-semibold tabular-nums">
                      {(r.totalWeightGrams / 1000).toFixed(1)}{" "}
                      <span className="text-sm font-medium text-gray-500">kg</span>
                    </div>
                  </div>

                  <div className="col-span-3 text-right">
                    <PriorityTriplet v={r.priorityUnits} unit={r.unit} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

/* ---------- UI 小物 ---------- */

function SummaryCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function PriorityTriplet({
  v,
  unit,
}: {
  v: Record<Priority, number>;
  unit: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-gray-800">
      <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 ring-1 ring-red-200">
        {v.high}
        {unit}
      </span>
      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        {v.medium}
        {unit}
      </span>
      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        {v.low}
        {unit}
      </span>
    </div>
  );
}

function DroneBadge({
  perUnit,
  unitsPerFlight,
  flights,
}: {
  perUnit: boolean;
  unitsPerFlight: number | null;
  flights: number | null;
}) {
  if (perUnit && unitsPerFlight && flights != null) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        <DroneIcon /> ドローン可：{unitsPerFlight} 単位/便 × {flights} 便
      </div>
    );
  }
  if (perUnit) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200">
        <DroneIcon /> ドローン可（分割搬送）
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 ring-1 ring-gray-200">
      <DroneIcon /> ドローン不可
    </div>
  );
}

function DroneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M3 7h5l2 3h4l2-3h5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M2 12h6M16 12h6M11 15l-2 5M13 15l2 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border p-8 bg-gray-50 text-center">
      <div className="text-lg font-semibold">申請データがありません</div>
      <p className="text-gray-600 mt-2">
        「必要物資リスト」ページで内容を保存すると、ここに一覧が表示されます。
      </p>
    </div>
  );
}
