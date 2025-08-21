"use client";

/**
 * ================================
 * 🔧 BACKEND INTEGRATION MEMO (for BE engineers)
 * ================================
 * 目的：
 * - 各アイテムIDごとに「楽天市場の代表1件（例：ランキング1位）」の “商品名 / 画像 / 価格 / 商品URL” を表示。
 * - API未接続でも動くよう、モック＋ローカル画像に自動フォールバックします。
 *
 * 期待するエンドポイント（例）：
 *   1) GET {BASE}/supplies/top?keyword=...&genreId=...
 *      → 指定キーワード / ジャンルの代表1件（ランキング1位 or 人気順先頭）を返す
 *      レスポンス（期待形）:
 *      {
 *        "item": {
 *          "productId": "rakuten:shopCode:itemCode" | 任意の一意ID（必須）,
 *          "productName": "商品名（楽天タイトルから整形推奨）",
 *          "imageUrl": "https://...(HTTPS画像URL)",
 *          "unitPriceYen": 1234,  // 数値
 *          "productUrl": "https://item.rakuten.co.jp/...（商品詳細URL）"
 *        }
 *      }
 *
 *   2) GET {BASE}/supplies/status?ids=p-water-2l,p-instant-rice,...
 *      → 必要数量/充足数量/更新日時を返す
 *      {
 *        "statuses": {
 *          "p-water-2l":    {"requested":120,"fulfilled":48,"updatedAtISO":"2025-08-20T12:34:56Z"},
 *          ...
 *        }
 *      }
 *
 * Link 仕様：
 * - 「楽天市場で見る」は BE の item.productUrl を最優先（その商品のページへ）。
 * - 無い場合は productName で楽天市場内検索にフォールバック。
 *
 * 画像の解決優先度：
 * - BE接続時：BEの imageUrl ＞ /public/products ＞ /public/images ＞ 手動候補URL
 * - モック時：/public/products ＞ /public/images ＞ 手動候補URL ＞（最後にBE画像）
 *
 * SSR/Hydration：
 * - 日時表示はマウント後にのみ描画（hydration mismatch 回避）。
 * - toLocaleString は timeZone 固定で整形。
 */

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/SupporterLayout";

/* ========= 型 ========= */
type Yen = number;
type TopItem = {
  productId: string;
  productName: string;
  imageUrl: string | null;
  unitPriceYen: number | null;
  productUrl: string | null;
};
type ProductStatus = {
  requested: number;
  fulfilled: number;
  updatedAtISO: string;
};
type CartItem = {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPriceYen?: Yen;
  imageUrl?: string;
};
type SupporterCart = { updatedAtISO: string; items: CartItem[] };

type Category = "食料" | "生活用品" | "衛生" | "医薬品";

type ProductMeta = {
  id: string; // /public/products/{id}.{png|jpg|webp}
  name: string;
  unit: string;
  category: Category;
  weightGrams: number;
  recommendedPerPersonPerDay?: number;
  imageVerified: boolean;
  genreId?: string;
  keyword?: string;
  notes?: string;
  localBasename?: string;
};

/* ========= 定数/ユーティリティ ========= */
const LS_KEY = "supporter:cart:v1";
const EMPTY_CART: SupporterCart = { updatedAtISO: "1970-01-01T00:00:00.000Z", items: [] };

const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";

const fmtJPY = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }) : "—";

const dtfJP = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "Asia/Tokyo",
});
const fmtJPDate = (iso?: string) => (iso ? dtfJP.format(new Date(iso)) : "—");

/** カッコ類を除去して検索用語にする */
const stripParens = (s: string) => s.replace(/[（(].*?[）)]/g, "").trim();

/* ========= ラインナップ（指定の確定版） ========= */
const RAW_PRODUCTS: readonly ProductMeta[] = [
  // === 食料 ===
  { id: "p-water-2l",     name: "飲料水 2L×6本（1ケース）", unit: "ケース", category: "食料",     weightGrams: 12000, imageVerified: false },
  { id: "p-instant-rice", name: "サトウのごはん 200g×5食",   unit: "箱",    category: "食料",     weightGrams: 1000,  recommendedPerPersonPerDay: 0.2, imageVerified: false },
  { id: "p-canned-food",  name: "缶詰(主食) 1缶",            unit: "缶",    category: "食料",     weightGrams: 350,   recommendedPerPersonPerDay: 1,   imageVerified: false },

  // === 生活用品・衛生 ===
  { id: "p-blanket",      name: "毛布",                      unit: "枚",    category: "生活用品", weightGrams: 800,   imageVerified: false },
  { id: "p-battery-aa",   name: "単3電池(8本)",              unit: "パック", category: "生活用品", weightGrams: 180,  imageVerified: false },
  { id: "p-mask",         name: "不織布マスク(50枚)",        unit: "箱",    category: "衛生",     weightGrams: 200,   recommendedPerPersonPerDay: 0.5, imageVerified: false },

  // === 医薬品 ===
  { id: "m-acetaminophen", name: "解熱鎮痛剤（アセトアミノフェン）20錠", unit: "箱", category: "医薬品", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-ibuprofen",     name: "解熱鎮痛剤（イブプロフェン）24錠",     unit: "箱", category: "医薬品", weightGrams: 28,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-cold-combo",    name: "総合感冒薬（風邪薬）30錠",             unit: "箱", category: "医薬品", weightGrams: 40,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-antihistamine", name: "抗ヒスタミン薬（アレルギー薬）10錠",   unit: "箱", category: "医薬品", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, imageVerified: false },
  { id: "m-anti-diarrhea", name: "下痢止め（ロペラミド等）12錠",         unit: "箱", category: "医薬品", weightGrams: 18,  recommendedPerPersonPerDay: 0.01, imageVerified: false },
  { id: "m-ors-500",       name: "経口補水液 500mL（1本）",               unit: "本", category: "医薬品", weightGrams: 500, recommendedPerPersonPerDay: 0.5, imageVerified: false },
  { id: "m-povidone",      name: "消毒液（ポビドンヨード）100mL",        unit: "本", category: "医薬品", weightGrams: 120, recommendedPerPersonPerDay: 0.01, imageVerified: false },
  { id: "m-sterile-gauze", name: "滅菌ガーゼ 10枚入",                     unit: "袋", category: "医薬品", weightGrams: 50,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-bandage-roll",  name: "包帯 5cm×5m",                           unit: "巻", category: "医薬品", weightGrams: 30,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-surgical-tape", name: "サージカルテープ 12mm×9m",              unit: "巻", category: "医薬品", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-bandaids",      name: "ばんそうこう（アソート20枚）",           unit: "箱", category: "医薬品", weightGrams: 80,  recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-thermometer",   name: "体温計",                                   unit: "本", category: "医薬品", weightGrams: 50,  recommendedPerPersonPerDay: 0.005, imageVerified: false },
  { id: "m-eyedrops",      name: "目薬（人工涙液）",                        unit: "本", category: "医薬品", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, imageVerified: false },
  { id: "m-cough-syrup",   name: "咳止めシロップ 120mL",                    unit: "本", category: "医薬品", weightGrams: 160, recommendedPerPersonPerDay: 0.02, imageVerified: false },
  { id: "m-throat-candy",  name: "のど飴",                                   unit: "袋", category: "医薬品", weightGrams: 80,  recommendedPerPersonPerDay: 0.05, imageVerified: false },
] as const;

const ALL_PRODUCTS: readonly ProductMeta[] = RAW_PRODUCTS.map(p => ({
  ...p,
  keyword: p.keyword ?? stripParens(p.name),
  localBasename: p.localBasename ?? p.id,
}));

/* ========= 任意：手動ランキング画像候補 ========= */
const RANKING_IMG_CANDIDATES: Record<string, string[]> = {
  // "p-water-2l": ["https://...jpg"],
};

/* ========= モック ========= */
function mockUnitPrice(meta: ProductMeta): number {
  switch (meta.category) {
    case "食料": return Math.round(600 + (meta.weightGrams ?? 0) / 20);
    case "生活用品": return 900;
    case "衛生": return 700;
    case "医薬品": return 500;
    default: return 800;
  }
}
function mockTop(itemId: string): TopItem | null {
  const meta = ALL_PRODUCTS.find(x => x.id === itemId);
  if (!meta) return null;
  return {
    productId: meta.id,
    productName: meta.name,
    imageUrl: null,                 // モックはローカル優先で解決
    unitPriceYen: mockUnitPrice(meta),
    productUrl: null,
  };
}
function mockStatus(itemId: string): ProductStatus {
  const meta = ALL_PRODUCTS.find(x => x.id === itemId)!;
  const idx = ALL_PRODUCTS.findIndex(x => x.id === itemId);
  const baseRequested =
    meta.category === "食料" ? 120 :
    meta.category === "生活用品" ? 70 :
    meta.category === "衛生" ? 150 :
    90; // 医薬品
  const fulfilled = Math.floor(baseRequested * (0.4 + ((idx % 10) / 20))); // 40〜85%
  return { requested: baseRequested, fulfilled, updatedAtISO: new Date().toISOString() };
}

/* ========= API ラッパ ========= */
const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE ?? "").replace(/\/$/, "");

async function fetchTopSafe(params: { keyword?: string; genreId?: string }, timeoutMs = 3500): Promise<TopItem | null> {
  if (!API_BASE) return null;
  const qs = new URLSearchParams();
  if (params.keyword) qs.set("keyword", params.keyword);
  if (params.genreId) qs.set("genreId", params.genreId);

  const url = `${API_BASE}/supplies/top?${qs.toString()}`;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!r.ok) return null;
    const data = await r.json().catch(() => null) as any;
    const it = data?.item;
    if (!it) return null;
    return {
      productId: String(it.productId ?? ""),
      productName: String(it.productName ?? "不明な商品"),
      imageUrl: it.imageUrl ? String(it.imageUrl) : null,
      unitPriceYen: typeof it.unitPriceYen === "number" ? it.unitPriceYen : Number(it.unitPriceYen ?? NaN) || null,
      productUrl: it.productUrl ? String(it.productUrl) : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}
async function fetchStatusesSafe(ids: string[], timeoutMs = 3500): Promise<Record<string, ProductStatus> | null> {
  if (!API_BASE || ids.length === 0) return null;
  const url = `${API_BASE}/supplies/status?ids=${encodeURIComponent(ids.join(","))}`;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!r.ok) return null;
    const data = await r.json().catch(() => null) as any;
    const raw = data?.statuses;
    if (!raw || typeof raw !== "object") return null;

    const normalized: Record<string, ProductStatus> = {};
    for (const k of Object.keys(raw)) {
      const s = raw[k];
      const req = Number(s?.requested ?? NaN);
      const ful = Number(s?.fulfilled ?? NaN);
      normalized[k] = {
        requested: Number.isFinite(req) ? req : 0,
        fulfilled: Number.isFinite(ful) ? ful : 0,
        updatedAtISO: String(s?.updatedAtISO ?? new Date().toISOString()),
      };
    }
    return normalized;
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

/* ========= 画像（見切れゼロ：枠にフィット） ========= */
function ProductImage({
  itemId,
  productId,
  localBasename,
  backendUrl,
  alt,
  useBackendFirst,
}: {
  itemId: string;
  productId: string | null;
  localBasename?: string;
  backendUrl?: string | null;
  alt: string;
  useBackendFirst: boolean;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [cands, setCands] = useState<string[]>([]);

  useEffect(() => {
    const stems = [localBasename, productId || undefined, itemId].filter(Boolean) as string[];
    const localProducts = stems.flatMap(stem => [".png", ".jpg", ".webp"].map(ext => `/products/${stem}${ext}`));
    const localImages = [".png", ".jpg", ".webp"].map(ext => `/images/${itemId}${ext}`);
    const ranking = RANKING_IMG_CANDIDATES[itemId] ?? [];
    const be = backendUrl ? [backendUrl] : [];
    const list = useBackendFirst
      ? [...be, ...localProducts, ...localImages, ...ranking]
      : [...localProducts, ...localImages, ...ranking, ...be];
    setCands(list);
    setSrc(list[0] ?? null);
  }, [itemId, productId, localBasename, backendUrl, useBackendFirst]);

  const onErr = () => {
    setCands(prev => {
      const next = prev.slice(1);
      setSrc(next[0] ?? null);
      return next;
    });
  };

  // 高さはブレークポイントで微調整。画像は常に「枠内に収まる（contain）」＆センター。
  return (
    <div className="relative w-full rounded-t-3xl bg-white overflow-hidden h-48 sm:h-56 md:h-60">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
          onError={onErr}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-xs text-gray-500">画像なし</div>
      )}
    </div>
  );
}

/* ========= cart storage ========= */
function loadCart(): SupporterCart {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw) as SupporterCart;
    return parsed && Array.isArray(parsed.items) ? parsed : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}
function saveCart(next: SupporterCart) {
  const stamped = { ...next, updatedAtISO: new Date().toISOString() };
  localStorage.setItem(LS_KEY, JSON.stringify(stamped));
  return stamped;
}

/* ========= ページ本体 ========= */
export default function SuppliesPage() {
  // Hydration mismatch 回避のため：初期は固定値、マウント後に同期
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<SupporterCart>(EMPTY_CART);

  const [tops, setTops] = useState<Record<string, (TopItem & { source: "backend" | "mock" }) | null>>({});
  const [statuses, setStatuses] = useState<Record<string, ProductStatus> | null>(null);
  const [selected, setSelected] = useState<Record<string, number>>({});

  // 初期ロード & 別タブ同期
  useEffect(() => {
    setCart(loadCart());
    setMounted(true);
    const onStorage = (e: StorageEvent) => { if (e.key === LS_KEY) setCart(loadCart()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 1商品=1件（API→失敗時モック）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        ALL_PRODUCTS.map(async (p) => {
          const fromApi = await fetchTopSafe({ keyword: p.keyword ?? stripParens(p.name), genreId: p.genreId });
          const pick = fromApi ?? mockTop(p.id);
          return [p.id, pick ? { ...pick, source: (fromApi ? "backend" : "mock") as const } : null] as const;
        })
      );
      if (!cancelled) setTops(Object.fromEntries(entries));
    })();
    return () => { cancelled = true; };
  }, []);

  // 達成率（API→失敗時モック）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = ALL_PRODUCTS.map(p => p.id);
      const fromApi = await fetchStatusesSafe(ids);
      let map: Record<string, ProductStatus> = {};
      if (fromApi) map = fromApi;
      else for (const id of ids) map[id] = mockStatus(id);
      if (!cancelled) setStatuses(map);
    })();
    return () => { cancelled = true; };
  }, []);

  // 数量セット（残量上限でクランプ）
  const setQty = (itemId: string, raw: number) => {
    const st = statuses?.[itemId];
    const remaining = st ? Math.max(0, st.requested - st.fulfilled) : 9999;
    const q = Math.max(0, Math.min(remaining, Math.floor(Number(raw) || 0)));
    setSelected(prev => ({ ...prev, [itemId]: q }));
  };

  // 下部バーの合計（選択中）
  const selectionSummary = useMemo(() => {
    let kinds = 0, units = 0, total = 0;
    for (const id of Object.keys(selected)) {
      const q = selected[id] || 0;
      if (q <= 0) continue;
      kinds++;
      units += q;
      const top = tops[id];
      if (top?.unitPriceYen) total += top.unitPriceYen * q;
    }
    return { kinds, units, total };
  }, [selected, tops]);

  // カートへ追加（選択分まとめて／既存加算）
  const addSelectionToCart = () => {
    const next = loadCart();
    const items = [...next.items];

    for (const id of Object.keys(selected)) {
      const qty = selected[id] || 0;
      if (qty <= 0) continue;

      const top = tops[id];
      const meta = ALL_PRODUCTS.find(p => p.id === id);
      if (!top || !meta) continue;

      const idx = items.findIndex(x => x.productId === top.productId);
      if (idx >= 0) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
      } else {
        items.push({
          productId: top.productId,
          productName: top.productName,
          unit: meta.unit,
          quantity: qty,
          unitPriceYen: top.unitPriceYen ?? undefined,
          imageUrl: top.imageUrl ?? undefined,
        });
      }
    }

    const saved = saveCart({ ...next, items });
    setCart(saved);
    setSelected({});
    alert(`${selectionSummary.kinds}種類・${selectionSummary.units}単位を買い物かごに追加しました！`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden pb-24">
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
            必要物資ラインナップ（各商品＝楽天1件）
          </h1>

          <p className="text-sm text-gray-600">
            {mounted && cart.updatedAtISO !== EMPTY_CART.updatedAtISO ? (
              <>カート最終更新：<b>{fmtJPDate(cart.updatedAtISO)}</b></>
            ) : (
              <span className="text-gray-400">カート同期中…</span>
            )}
          </p>

          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_PRODUCTS.map((p) => {
              const top = tops[p.id];
              const st = statuses?.[p.id];

              const current = selected[p.id] ?? 0;
              const projectedFulfilled = st ? Math.min(st.requested, st.fulfilled + current) : current;
              const remaining = st ? Math.max(0, st.requested - st.fulfilled - current) : null;
              const percent = st ? (st.requested > 0 ? (projectedFulfilled / st.requested) * 100 : 0) : null;
              const isFullyStocked = st ? projectedFulfilled >= st.requested : false;

              const rkLink =
                top?.productUrl ??
                (top?.productName
                  ? `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(stripParens(top.productName))}`
                  : `https://www.rakuten.co.jp/`);

              const useBackendFirst = top?.source === "backend"; // BE接続時はBE画像優先、モック時はローカル優先

              return (
                <article
                  key={p.id}
                  className={`rounded-3xl shadow-sm transition-all duration-200 bg-white border ${
                    isFullyStocked ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  {/* 画像：枠に完全フィット（見切れゼロ） */}
                  <div className="relative">
                    <ProductImage
                      itemId={p.id}
                      productId={top?.productId ?? null}
                      localBasename={p.localBasename}
                      backendUrl={top?.imageUrl ?? null}
                      alt={top?.productName ?? p.name}
                      useBackendFirst={useBackendFirst}
                    />
                    {top?.source === "mock" && (
                      <div className="absolute left-3 top-3">
                        <span className="rounded-md bg-gray-800/80 text-white text-[10px] px-2 py-1">DEMO</span>
                      </div>
                    )}
                    {isFullyStocked && (
                      <div className="absolute right-3 top-3">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 本文（元デザイン寄せ） */}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{p.category}</span>
                      <h3 className="font-bold text-lg mt-2 leading-tight">{top?.productName ?? p.name}</h3>
                    </div>

                    {p.notes && (
                      <div className="text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <strong>備考:</strong> {p.notes}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">必要数量</span>
                        <span className="text-xl font-bold">
                          {st ? st.requested.toLocaleString() : "—"}{" "}
                          <span className="text-sm font-normal text-gray-500">{p.unit}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">参考価格</span>
                        <span className="text-sm font-medium">{fmtJPY(top?.unitPriceYen ?? undefined)}</span>
                      </div>
                    </div>

                    {/* 達成率（入力に連動） */}
                    {st && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">達成率</span>
                          <span className={`font-medium ${isFullyStocked ? "text-green-600" : "text-blue-600"}`}>
                            {Math.min(100, Math.round(percent!))}%（{projectedFulfilled.toLocaleString()} / {st.requested.toLocaleString()}）
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${isFullyStocked ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${Math.min(100, Math.round(percent!))}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-gray-500">
                          残り：{(remaining ?? 0).toLocaleString()} {p.unit} ／ 最終更新：{fmtJPDate(st.updatedAtISO)}
                        </div>
                      </div>
                    )}

                    {/* 数量入力 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">支援する数量</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            min={0}
                            max={st ? Math.max(0, st.requested - st.fulfilled) : undefined}
                            value={selected[p.id] ?? 0}
                            onChange={(e) => setQty(p.id, parseInt(e.target.value, 10) || 0)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-lg font-bold focus:border-blue-500 focus:ring-0"
                            aria-label="支援数量"
                          />
                        </div>
                        <span className="text-sm text-gray-500">{p.unit}</span>
                      </div>
                      {st && isFullyStocked && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <span className="text-green-600">✓</span>
                          必要数が満たされました！
                        </p>
                      )}
                    </div>

                    {/* アクション：楽天市場で見る（BEの productUrl 優先） */}
                    <div className="pt-1">
                      <a
                        href={rkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
                        title="楽天市場で商品詳細を見る（新しいタブ）"
                      >
                        楽天市場で見る
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        {/* 下部固定バー（選択済みの一括投入） */}
        {selectionSummary.kinds > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
            <div className="mx-auto max-w-screen-xl px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">🛒</span>
                    <span className="font-semibold">{selectionSummary.kinds}</span>
                    <span className="text-sm">種類選択中</span>
                  </div>
                  <div className="hidden sm:block text-sm text-gray-600">
                    合計 <span className="font-semibold">{selectionSummary.units}</span> 単位
                    {selectionSummary.total > 0 && (
                      <span className="ml-2">
                        (約 <span className="font-semibold">{fmtJPY(selectionSummary.total)}</span>)
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addSelectionToCart}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold transition-colors duration-200"
                  style={{ backgroundColor: RAKUTEN_RED }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                >
                  買い物かごに追加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
