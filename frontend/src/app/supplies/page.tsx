"use client";
import React, { useMemo, useState, useEffect } from "react";


// ===== Types =====
export type Priority = "high" | "medium" | "low"; // 予備（使わない場合は削除可）
export type Category = "医薬品" | "衛生" | "食料" | "生活用品";

export interface Product {
  id: string;
  name: string;
  unit: string; // 例: 本, 食, パック, 枚, 缶, 箱
  weightGrams: number; // 1単位あたり重量(g) — ドローン可否判定に使用
  recommendedPerPersonPerDay?: number; // 推奨/人/日（例: 水=1.5本など）
  imageUrl?: string; // 商品画像
  imageVerified?: boolean; // 画像の正確性が検証済みかどうか
  category: Category;
}

export interface NeedRow {
  id: string; // UI用行ID
  productId: string; // CATALOG/props.products から選択
  quantity: number; // 自由入力
  express: boolean; // 速達希望
  notes?: string;
}

export interface NeedsListPayload {
  evacueeCount: number; // 避難人数
  targetDays: number;   // 対象日数
  items: Array<{
    productId: string;
    quantity: number;
    express: boolean;
    notes?: string;
    droneEligible: boolean; // 判定結果を同梱
  }>;
}

// ===== Theme (Rakuten-like) =====
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";

// ===== Config =====
const DRONE_MAX_PAYLOAD_G = 2000; // 1回あたりの目安（必要に応じて調整）

// ===== Helpers =====
function toSafeNumber(v: any, def = 0, min?: number) {
  const n = typeof v === "number" ? v : Number(v);
  const f = Number.isFinite(n) ? n : def;
  return typeof min === "number" ? Math.max(min, f) : f;
}
function gid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function calcRecommended(p: Product | undefined, evacueeCount: number, targetDays: number) {
  if (!p || !p.recommendedPerPersonPerDay) return undefined;
  const val = p.recommendedPerPersonPerDay * Math.max(0, evacueeCount) * Math.max(1, targetDays);
  return Math.round(val * 2) / 2; // 0.5刻み
}
function isDroneEligible(p: Product | undefined, quantity: number) {
  if (!p) return false;
  const total = p.weightGrams * Math.max(0, quantity);
  return total <= DRONE_MAX_PAYLOAD_G;
}

// ===== Default Catalog (DB連携時は props.products を渡して差し替え) =====
// 画像URLはデモ用だが、不正確さ回避のため imageVerified=false（表示しない）。
const DEFAULT_CATALOG: Product[] = [
  // === 食料・水 ===
  { id: "p-water-2l",     name: "飲料水１ケース 2L×6本",                unit: "ケース",    weightGrams: 12000, recommendedPerPersonPerDay: 0.15, category: "食料", imageVerified: false },
  { id: "p-instant-rice", name: "サトウのごはん 200g×5食",      unit: "箱",    weightGrams: 1000,  recommendedPerPersonPerDay: 0.2,   category: "食料", imageVerified: false },
  { id: "p-canned-food",  name: "缶詰(主食) 1缶",          unit: "缶",    weightGrams: 350,  recommendedPerPersonPerDay: 1,   category: "食料", imageVerified: false },

  // === 生活用品・衛生 ===
  { id: "p-blanket",      name: "毛布",                    unit: "枚",    weightGrams: 800,  category: "生活用品", imageVerified: false },
  { id: "p-battery-aa",   name: "単3電池(8本)",             unit: "パック", weightGrams: 180,  category: "生活用品", imageVerified: false },
  { id: "p-mask",         name: "不織布マスク(50枚)",       unit: "箱",    weightGrams: 200,  recommendedPerPersonPerDay: 0.5, category: "衛生", imageVerified: false },

  // === 医薬品（豊富化） ===
  { id: "m-acetaminophen", name: "解熱鎮痛剤（アセトアミノフェン）20錠", unit: "箱", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-ibuprofen",     name: "解熱鎮痛剤（イブプロフェン）24錠",     unit: "箱", weightGrams: 28,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-cold-combo",    name: "総合感冒薬（風邪薬）30錠",             unit: "箱", weightGrams: 40,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-antihistamine", name: "抗ヒスタミン薬（アレルギー薬）10錠",   unit: "箱", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-anti-diarrhea", name: "下痢止め（ロペラミド等）12錠",         unit: "箱", weightGrams: 18,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-ors-500",       name: "経口補水液 500mL×24",                     unit: "本", weightGrams: 500, recommendedPerPersonPerDay: 0.5, category: "医薬品", imageVerified: false },
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

// ===== Component =====
export default function NeedsListForm({
  products,
  initialEvacueeCount = 100,
  initialTargetDays = 3,
  onSubmit,
  enforceVerifiedImages = false, // 既定: 検証済み画像のみ表示
}: {
  products?: Product[]; // DBからの一覧をそのまま渡せる（imageVerified 推奨）
  initialEvacueeCount?: number;
  initialTargetDays?: number;
  onSubmit?: (payload: NeedsListPayload) => void;
  enforceVerifiedImages?: boolean;
}) {
  const catalog = products && products.length > 0 ? products : DEFAULT_CATALOG;

  const [evacueeCount, setEvacueeCount] = useState(initialEvacueeCount);
  const [targetDays, setTargetDays] = useState(initialTargetDays);
  const [rows, setRows] = useState<NeedRow[]>([
    { id: gid(), productId: catalog[0]?.id ?? "", quantity: 1, express: false, notes: "" },
  ]);
  const [saving, setSaving] = useState(false);

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

  function updateRow<T extends keyof NeedRow>(id: string, key: T, value: NeedRow[T]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: gid(), productId: catalog[0]?.id ?? "", quantity: 1, express: false, notes: "" },
    ]);
  }
  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function handleSave() {
    // バリデーション & ペイロード組み立て
    const cleaned = rows.map((r) => ({
      ...r,
      quantity: toSafeNumber(r.quantity, 1, 0),
      notes: (r.notes ?? "").trim() || undefined,
    }));
    const invalid = cleaned.find((r) => !productMap.get(r.productId) || r.quantity <= 0);
    if (invalid) {
      alert("各行の『品目』と『数量(>0)』を確認してください");
      return;
    }

    const payload: NeedsListPayload = {
      evacueeCount: Math.max(0, toSafeNumber(evacueeCount, 0)),
      targetDays: Math.max(1, toSafeNumber(targetDays, 1)),
      items: cleaned.map(({ productId, quantity, express, notes }) => ({
        productId,
        quantity,
        express,
        notes,
        droneEligible: isDroneEligible(productMap.get(productId), quantity),
      })),
    };

    setSaving(true);
    try {
      onSubmit ? onSubmit(payload) : console.log("NeedsListPayload", payload);
      alert("必要物資リストを作成しました（コンソールにも出力しています）");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl p-4 text-sm">
        <h1 className="text-2xl font-bold mb-4">必要物資リスト 登録</h1>

        {/* 上段: 規模パラメータ */}
        <div className="grid gap-3 sm:grid-cols-3 bg-white rounded-2xl p-3 border mb-6">
          <label className="flex flex-col gap-1">
            <span className="font-medium">避難人数</span>
            <input
              type="number"
              min={0}
              className="rounded-lg border px-3 py-2"
              value={evacueeCount}
              onChange={(e) => setEvacueeCount(toSafeNumber(e.target.value, evacueeCount, 0))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">対象日数</span>
            <input
              type="number"
              min={1}
              className="rounded-lg border px-3 py-2"
              value={targetDays}
              onChange={(e) => setTargetDays(toSafeNumber(e.target.value, targetDays, 1))}
            />
          </label>
          <div className="flex items-end text-gray-600">
            <p className="text-xs leading-tight">おすすめ数 = 1人1日あたり目安 × 人数 × 日数（0.5刻み）</p>
          </div>
        </div>

        {/* テーブル */}
        <section className="mb-8">
          <h2 className="font-semibold mb-2">必要物資</h2>
          <div className="rounded-xl border overflow-x-auto bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">商品</th>
                  <th className="p-2">画像</th>
                  <th className="p-2 text-right">数量</th>
                  <th className="p-2">単位</th>
                  <th className="p-2">おすすめ</th>
                  <th className="p-2">速達</th>
                  <th className="p-2">ドローン</th>
                  <th className="p-2">備考</th>
                  <th className="p-2 w-24">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const prod = productMap.get(r.productId);
                  const rec = calcRecommended(prod, evacueeCount, targetDays);
                  const droneOk = isDroneEligible(prod, r.quantity);
                  return (
                    <tr key={r.id} className="border-t align-top">
                      <td className="p-2">
                        <select
                          className="w-full rounded-lg border px-2 py-1"
                          value={r.productId}
                          onChange={(e) => updateRow(r.id, "productId", e.target.value)}
                          aria-label="商品を選択"
                        >
                          {Array.from(grouped.entries()).map(([cat, list]) => (
                            <optgroup key={cat} label={cat}>
                              {list.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <ProductThumb product={prod} enforceVerified={enforceVerifiedImages} />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          className="w-24 rounded-lg border px-2 py-1 text-right"
                          value={r.quantity}
                          onChange={(e) => updateRow(r.id, "quantity", toSafeNumber(e.target.value, r.quantity, 0))}
                          aria-label="数量"
                        />
                      </td>
                      <td className="p-2 text-center">{prod?.unit ?? "—"}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>{rec ?? "—"}{rec != null && ` ${prod?.unit ?? ""}`}</span>
                          <button
                            type="button"
                            disabled={rec == null}
                            onClick={() => rec != null && updateRow(r.id, "quantity", rec)}
                            className="rounded px-2 py-1 text-white disabled:opacity-50"
                            style={{ backgroundColor: RAKUTEN_RED }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                            title="おすすめ数を数量に反映"
                          >
                            反映
                          </button>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={r.express}
                          onChange={(e) => updateRow(r.id, "express", e.target.checked)}
                          aria-label="速達希望"
                        />
                      </td>
                      <td className="p-2 text-center">
                        {droneOk ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">可</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5">不可</span>
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          className="w-full rounded-lg border px-2 py-1"
                          placeholder="任意"
                          value={r.notes ?? ""}
                          onChange={(e) => updateRow(r.id, "notes", e.target.value)}
                          aria-label="備考"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeRow(r.id)}
                          className="rounded-lg px-2 py-1 text-white"
                          style={{ backgroundColor: RAKUTEN_RED }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                          title="行を削除"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <button
              onClick={addRow}
              className="rounded-lg px-3 py-1.5 text-white"
              style={{ backgroundColor: RAKUTEN_RED }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
            >
              ＋ 行を追加
            </button>
          </div>
        </section>

        {/* 保存 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">保存するとペイロードを返します（デフォルトは console.log）。</div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-5 py-2 text-white disabled:opacity-50"
            style={{ backgroundColor: RAKUTEN_RED }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
          >
            {saving ? "保存中…" : "必要物資リストを保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== UI: Product Thumbnail =====
function ProductThumb({ product, enforceVerified }: { product?: Product; enforceVerified?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);

  // policy: 検証厳格なら DBの imageUrl が未検証のときは表示しない
  const allowByPolicy =
    !product ? false :
    !enforceVerified || product.imageVerified || !product.imageUrl;

  useEffect(() => {
    if (!product || !allowByPolicy) { setSrc(null); return; }
    // 優先: 明示された imageUrl / 次点: /products/<id>.jpg
    setSrc(product.imageUrl ?? `/products/${product.id}.jpg`);
  }, [product, allowByPolicy]);

  const onError = () => {
    if (!product) return;
    // jpg → png → webp の順で試す
    if (!src || src.endsWith(".webp")) { setSrc(null); return; }
    if (src.endsWith(".jpg")) setSrc(`/products/${product.id}.png`);
    else if (src.endsWith(".png")) setSrc(`/products/${product.id}.webp`);
    else setSrc(null);
  };

  if (!product || !allowByPolicy || !src) {
    return (
      <div className="h-12 w-12 rounded overflow-hidden bg-gray-50 flex items-center justify-center border">
        <CategoryIcon category={product?.category ?? "生活用品"} />
      </div>
    );
  }

  return (
    <div className="h-12 w-12 rounded overflow-hidden bg-gray-50 flex items-center justify-center border">
      <img
        src={src}
        alt={product.name}
        className="h-full w-full object-cover"
        onError={onError}
      />
    </div>
  );
}

// ===== UI: Category Icon (SVG) =====
function CategoryIcon({ category }: { category: Category }) {
  const common = "h-6 w-6";
  switch (category) {
    case "医薬品":
      return (
        <svg viewBox="0 0 24 24" className={common} role="img" aria-label="医薬品">
          <path d="M7 10h10v2H7z" fill="#555"/>
          <rect x="6" y="6" width="12" height="8" rx="2" fill="#bbb"/>
          <rect x="8" y="14" width="8" height="6" rx="2" fill="#e2e8f0"/>
        </svg>
      );
    case "衛生":
      return (
        <svg viewBox="0 0 24 24" className={common} role="img" aria-label="衛生">
          <circle cx="12" cy="8" r="3" fill="#bbb"/>
          <rect x="9" y="11" width="6" height="7" rx="2" fill="#e2e8f0"/>
        </svg>
      );
    case "食料":
      return (
        <svg viewBox="0 0 24 24" className={common} role="img" aria-label="食料">
          <path d="M5 12h14v6H5z" fill="#e2e8f0"/>
          <rect x="7" y="6" width="10" height="6" rx="1" fill="#bbb"/>
        </svg>
      );
    case "生活用品":
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} role="img" aria-label="生活用品">
          <rect x="6" y="6" width="12" height="12" rx="2" fill="#e2e8f0"/>
          <path d="M8 10h8v2H8z" fill="#bbb"/>
        </svg>
      );
  }
}
