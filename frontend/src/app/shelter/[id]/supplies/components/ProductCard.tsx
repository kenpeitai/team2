import React, { useEffect, useCallback } from "react";
import { Product, NeedRow, Priority, Category } from "../types";
import { RAKUTEN_RED, RAKUTEN_RED_HOVER, WATER_L_PER_PERSON_PER_DAY, ML_PER_L } from "../constants";

interface ProductCardProps {
  row: NeedRow;
  product?: Product;
  grouped: Map<Category, Product[]>;
  selectedIds: Set<string>;
  evacueeCount: number;
  targetDays: number;
  imageState?: { src: string | null; candidates: string[]; open: boolean };
  enforceVerifiedImages?: boolean;
  onProductChange: (rowId: string, newId: string) => void;
  onRowUpdate: (updates: Partial<NeedRow>) => void;
  onImageStateChange: (updates: Partial<{ src: string | null; candidates: string[]; open: boolean }>) => void;
  onRemove: () => void;
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

function toSafeNumber(v: any, def = 0, min?: number) {
  const n = typeof v === "number" ? v : Number(v);
  const f = Number.isFinite(n) ? n : def;
  return typeof min === "number" ? Math.max(min, f) : f;
}

export function ProductCard({
  row,
  product,
  grouped,
  selectedIds,
  evacueeCount,
  targetDays,
  imageState,
  enforceVerifiedImages,
  onProductChange,
  onRowUpdate,
  onImageStateChange,
  onRemove
}: ProductCardProps) {
  const rec = calcRecommended(product, evacueeCount, targetDays);

  return (
    <article className="group bg-white rounded-lg border border-black/10 dark:border-white/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* 画像セクション */}
      <div className="relative">
        <ProductHeroImage 
          product={product} 
          enforceVerified={enforceVerifiedImages}
          imageState={imageState}
          onImageStateChange={onImageStateChange}
        />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <PriorityChip priority={row.priority} />
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <button
            onClick={onRemove}
            className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
            title="この物資を削除"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* コンテンツセクション */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* 商品選択 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">物資の種類</label>
          <select
            className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30 text-sm"
            value={row.productId}
            onChange={(e) => onProductChange(row.id, e.target.value)}
            aria-label="商品を選択"
          >
            {Array.from(grouped.entries()).map(([cat, list]) => (
              <optgroup key={cat} label={cat}>
                {list.map((p) => {
                  const isUsedElsewhere = selectedIds.has(p.id) && row.productId !== p.id;
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

        {/* 数量とおすすめ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">必要数量</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="number"
                min={0}
                step={product?.id === "p-water-2l" ? 1 : 0.5}
                className="flex-1 rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 text-right outline-none focus:ring-2 focus:ring-foreground/30 text-sm"
                value={row.quantity}
                onChange={(e) => onRowUpdate({ quantity: toSafeNumber(e.target.value, row.quantity, 0) })}
                aria-label="数量"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground/70 bg-foreground/5 px-2 sm:px-3 py-2 rounded-md whitespace-nowrap">
                {product?.unit ?? "—"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">推奨数量</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex-1 text-sm sm:text-lg font-semibold text-foreground bg-foreground/5 px-2 sm:px-3 py-2 rounded-md border border-black/10 dark:border-white/20 truncate">
                {rec ?? "—"}{rec != null && product?.unit && ` ${product.unit}`}
              </span>
              <button
                type="button"
                disabled={rec == null}
                onClick={() => rec != null && onRowUpdate({ quantity: rec })}
                className="btn btn-primary px-3 sm:px-4 py-2 bg-foreground/5 text-foreground hover:bg-foreground/10 disabled:bg-foreground/30 disabled:text-foreground/50 font-medium rounded-md border border-black/10 dark:border-white/20 transition-colors duration-200 disabled:cursor-not-allowed text-xs sm:text-sm whitespace-nowrap"
                title="推奨数量を適用"
              >
                適用
              </button>
            </div>
          </div>
        </div>

        {/* 優先度と備考 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">優先度</label>
            <select
              className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30 text-sm"
              value={row.priority}
              onChange={(e) => onRowUpdate({ priority: e.target.value as Priority })}
              aria-label="優先度"
            >
              <option value="high">高優先度</option>
              <option value="medium">中優先度</option>
              <option value="low">低優先度</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">備考</label>
            <input
              className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30 text-sm"
              placeholder="特記事項があれば入力"
              value={row.notes ?? ""}
              onChange={(e) => onRowUpdate({ notes: e.target.value })}
              aria-label="備考"
            />
          </div>
        </div>

        {/* 重量情報 */}
        {product && (
          <div className="bg-foreground/5 rounded-md p-3 sm:p-4 border border-black/10 dark:border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
              <span className="text-foreground font-medium">重量情報</span>
              <span className="text-foreground/70">
                <span className="block sm:inline">単体: {(product.weightGrams / 1000).toFixed(1)}kg</span>
                {row.quantity > 0 && (
                  <span className="block sm:inline sm:ml-2 font-semibold">
                    合計: {((product.weightGrams * row.quantity) / 1000).toFixed(1)}kg
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ===== UI: Priority Chip =====
function PriorityChip({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; cls: string; icon: string }> = {
    high: { 
      label: "高", 
      cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    },
    medium: { 
      label: "中", 
      cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    },
    low: { 
      label: "低", 
      cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    },
  };
  const v = map[priority];
  return (
    <span className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold border ${v.cls}`}>
      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
      </svg>
      <span className="hidden sm:inline">優先度: </span>{v.label}
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

  const currentSrc = imageState?.src;
  const currentOpen = imageState?.open ?? false;

  const onError = useCallback(() => {
    const currentCandidates = imageState?.candidates ?? [];
    const next = currentCandidates.slice(1);
    onImageStateChange({ candidates: next, src: next[0] ?? null });
  }, [imageState?.candidates, onImageStateChange]);

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
  }, [product, allowByPolicy]); // onImageStateChangeを依存配列から削除

  // 画像なし時はグラデ背景プレースホルダ
  if (!product || !allowByPolicy || !currentSrc) {
    return (
      <div className="w-full h-32 sm:h-48 bg-foreground/5 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-pulse"></div>
        <div className="relative z-10">
          <CategoryIcon category={product?.category ?? "生活用品"} size="xl" />
          <p className="text-foreground/50 text-xs sm:text-sm mt-1 sm:mt-2 font-medium text-center">{product?.category ?? "生活用品"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-32 sm:h-48 overflow-hidden bg-foreground/5">
        <img
          src={currentSrc}
          alt={product.name}
          className="h-full w-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
          onError={onError}
          onClick={() => onImageStateChange({ open: true })}
        />
      </div>
      {currentOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => onImageStateChange({ open: false })}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => onImageStateChange({ open: false })}
              className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={currentSrc}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

// ===== UI: Category Icon (SVG) =====
function CategoryIcon({ category, size = "lg" }: { category: Category; size?: "md" | "lg" | "xl" }) {
  const s = size === "xl" ? "h-12 w-12 sm:h-16 sm:w-16" : size === "lg" ? "h-6 w-6 sm:h-8 sm:w-8" : "h-4 w-4 sm:h-6 sm:w-6";
  const color = "text-foreground/30";
  
  switch (category) {
    case "医薬品":
      return (
        <svg viewBox="0 0 24 24" className={`${s} ${color}`} role="img" aria-label="医薬品">
          <path d="M7 10h10v2H7z" fill="currentColor"/>
          <rect x="6" y="6" width="12" height="8" rx="2" fill="currentColor" opacity="0.3"/>
          <rect x="8" y="14" width="8" height="6" rx="2" fill="currentColor" opacity="0.2"/>
        </svg>
      );
    case "衛生":
      return (
        <svg viewBox="0 0 24 24" className={`${s} ${color}`} role="img" aria-label="衛生">
          <circle cx="12" cy="8" r="3" fill="currentColor" opacity="0.3"/>
          <rect x="9" y="11" width="6" height="7" rx="2" fill="currentColor" opacity="0.2"/>
        </svg>
      );
    case "食料":
      return (
        <svg viewBox="0 0 24 24" className={`${s} ${color}`} role="img" aria-label="食料">
          <path d="M5 12h14v6H5z" fill="currentColor" opacity="0.2"/>
          <rect x="7" y="6" width="10" height="6" rx="1" fill="currentColor" opacity="0.3"/>
        </svg>
      );
    case "生活用品":
    default:
      return (
        <svg viewBox="0 0 24 24" className={`${s} ${color}`} role="img" aria-label="生活用品">
          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" opacity="0.2"/>
          <path d="M8 10h8v2H8z" fill="currentColor" opacity="0.3"/>
        </svg>
      );
  }
}

