"use client";
import Layout from "@/components/Layout";
import React, { useMemo, useCallback } from "react";
import { ProductCard } from "./components/ProductCard";
import { SummaryBar } from "./components/SummaryBar";
import { useSuppliesState } from "./hooks/useSuppliesState";
import { useProductCatalog } from "./hooks/useProductCatalog";
import { useNeedsListValidation } from "./hooks/useNeedsListValidation";
import { DEFAULT_CATALOG, DRONE_MAX_PAYLOAD_G, WATER_L_PER_PERSON_PER_DAY } from "./constants";
import { Product, NeedRow, NeedsListPayload, Priority } from "./types";

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
  
  const { state, dispatch } = useSuppliesState({
    initialEvacueeCount,
    initialTargetDays,
    catalog
  });

  const { productMap, grouped, selectedIds } = useProductCatalog(catalog, state.rows);
  const { validateAndCreatePayload } = useNeedsListValidation(productMap, DRONE_MAX_PAYLOAD_G);

  // 優先度順ソート（表示用）
  const sortedRows = useMemo(() => {
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return [...state.rows].sort((a, b) => rank[a.priority] - rank[b.priority]);
  }, [state.rows]);

  // サマリー計算
  const totals = useMemo(() => {
    let units = 0, weight = 0, waterCases = 0;
    state.rows.forEach((r: NeedRow) => {
      const p = productMap.get(r.productId);
      if (!p) return;
      units += Number(r.quantity) || 0;
      weight += p.weightGrams * (Number(r.quantity) || 0);
      if (p.id === "p-water-2l") waterCases += Number(r.quantity) || 0;
    });
    return {
      units,
      weightKg: Math.round(weight) / 1000,
      waterCases,
    };
  }, [state.rows, productMap]);

  // イベントハンドラー
  const handleProductChange = useCallback((rowId: string, newId: string) => {
    const usedByOther = state.rows.some((rr: NeedRow) => rr.id !== rowId && rr.productId === newId);
    if (usedByOther) {
      alert("この商品は既に他の行で選択されています。");
      return;
    }
    dispatch({ type: 'UPDATE_ROW', payload: { id: rowId, updates: { productId: newId } } });
  }, [state.rows, dispatch]);

  const handleAddRow = useCallback(() => {
    const used = new Set(state.rows.map((r: NeedRow) => r.productId));
    const next = catalog.find((p: Product) => !used.has(p.id));
    if (!next) {
      alert("追加できる商品がありません（全商品が選択済み）");
      return;
    }
    dispatch({ type: 'ADD_ROW', payload: { 
      id: Math.random().toString(36).slice(2) + Date.now().toString(36), 
      productId: next.id, 
      quantity: 1, 
      priority: "medium", 
      notes: "" 
    }});
  }, [state.rows, catalog, dispatch]);

  const handleRemoveRow = useCallback((id: string) => {
    if (state.rows.length > 1) {
      dispatch({ type: 'REMOVE_ROW', payload: id });
    }
  }, [state.rows.length, dispatch]);

  const handleSave = useCallback(async () => {
    const payload = validateAndCreatePayload(state);
    if (!payload) return;

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      onSubmit ? onSubmit(payload) : console.log("NeedsListPayload", payload);
      alert("必要物資リストを作成しました（コンソールにも出力しています）");
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state, validateAndCreatePayload, onSubmit, dispatch]);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* ヒーローセクション */}
        <HeroSection 
          evacueeCount={state.evacueeCount}
          targetDays={state.targetDays}
          onEvacueeCountChange={(value) => dispatch({ type: 'SET_EVACUEE_COUNT', payload: value })}
          onTargetDaysChange={(value) => dispatch({ type: 'SET_TARGET_DAYS', payload: value })}
        />

        {/* 商品カードグリッド */}
        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">必要物資リスト</h2>
            <p className="text-sm text-foreground/70">避難所の必要物資を管理し、効率的な支援を実現します</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedRows.map((row) => (
              <ProductCard
                key={row.id}
                row={row}
                product={productMap.get(row.productId)}
                grouped={grouped}
                selectedIds={selectedIds}
                evacueeCount={state.evacueeCount}
                targetDays={state.targetDays}
                imageState={state.imageStates[row.productId]}
                enforceVerifiedImages={enforceVerifiedImages}
                onProductChange={handleProductChange}
                onRowUpdate={(updates) => dispatch({ type: 'UPDATE_ROW', payload: { id: row.id, updates } })}
                onImageStateChange={(updates) => dispatch({ 
                  type: 'SET_IMAGE_STATE', 
                  payload: { productId: row.productId, updates } 
                })}
                onRemove={() => handleRemoveRow(row.id)}
              />
            ))}
          </div>

          {/* 追加ボタン */}
          <div className="mt-12 text-center">
            <button
              onClick={handleAddRow}
              className="btn btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新しい物資を追加
            </button>
          </div>
        </section>

        {/* 固定サマリーバー */}
        <SummaryBar
          totals={totals}
          saving={state.saving}
          onApplyRecommendAll={() => {
            const updatedRows = state.rows.map((r: NeedRow) => {
              const p = productMap.get(r.productId);
              const rec = p?.recommendedPerPersonPerDay 
                ? Math.round(p.recommendedPerPersonPerDay * Math.max(0, state.evacueeCount) * Math.max(1, state.targetDays) * 2) / 2
                : undefined;
              return rec != null ? { ...r, quantity: rec } : r;
            });
            dispatch({ type: 'SET_ROWS', payload: updatedRows });
          }}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
}

// ===== Hero Section Component =====
function HeroSection({
  evacueeCount,
  targetDays,
  onEvacueeCountChange,
  onTargetDaysChange,
}: {
  evacueeCount: number;
  targetDays: number;
  onEvacueeCountChange: (value: number) => void;
  onTargetDaysChange: (value: number) => void;
}) {
  return (
    <div className="bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            避難所物資管理システム
          </h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto">
            避難者の人数と日数に基づいて、必要な物資を効率的に計算・管理します
          </p>
        </div>
        
        <div className="bg-white border border-black/10 rounded-lg p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium mb-2">避難人数</span>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  value={evacueeCount}
                  onChange={(e) => onEvacueeCountChange(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="避難者数を入力"
                />
              </label>
            </div>
            
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium mb-2">対象日数</span>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  value={targetDays}
                  onChange={(e) => onTargetDaysChange(Math.max(1, Number(e.target.value) || 1))}
                  placeholder="支援日数を入力"
                />
              </label>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-foreground/5 rounded-md">
            <p className="text-sm text-foreground/70">
              <strong>計算基準:</strong> 水は {WATER_L_PER_PERSON_PER_DAY}L/人/日で自動換算（ケース単位で切り上げ）。その他の物資はカタログの推奨量を基準に計算されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
