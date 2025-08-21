"use client";
import Layout from "@/components/ShelterLayout";
import React, { useMemo, useCallback, useState } from "react";
import { ProductCard } from "./components/ProductCard";
import { SummaryBar } from "./components/SummaryBar";
import { useSuppliesState } from "./hooks/useSuppliesState";
import { useProductCatalog } from "./hooks/useProductCatalog";
import { useNeedsListValidation } from "./hooks/useNeedsListValidation";
import { RakutenProductManager } from "@/components/RakutenProductManager";
import { DRONE_MAX_PAYLOAD_G, WATER_L_PER_PERSON_PER_DAY } from "./constants";
import { Product, NeedRow, NeedsListPayload, Priority } from "./types";
import { useParams, useRouter } from "next/navigation";
import { createNeedsList } from "@/lib/api/supplies";
import type { NeedsListDto } from "@/types/api";
import BackButton from "@/components/BackButton";

// ===== 型定義 =====

interface NeedsListFormProps {
  products?: Product[];
  initialEvacueeCount?: number;
  initialTargetDays?: number;
  onSubmit?: (payload: NeedsListPayload) => void;
  enforceVerifiedImages?: boolean;
}

// ===== メインコンポーネント =====

/**
 * 避難所物資リスト作成フォーム
 * 楽天市場商品データを使用して物資の需要リストを作成
 */
export default function NeedsListForm({
  products,
  initialEvacueeCount = 100,
  initialTargetDays = 3,
  onSubmit,
  enforceVerifiedImages = false,
}: NeedsListFormProps) {
  // ===== 状態管理 =====
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  // ===== データ処理 =====
  
  /**
   * 楽天市場商品データの準備完了時のハンドラー
   */
  const handleProductsReady = useCallback((products: Product[]) => {
    setCurrentProducts(products);
  }, []);
  
  /**
   * データベース保存用商品データの準備完了時のハンドラー
   * 現状は未使用だが、将来的な拡張のために受け取っておく
   */
  const handleDatabaseProductsReady = useCallback((_products: Product[]) => {
    // no-op
  }, []);
  
  /**
   * ローディング状態の変更ハンドラー
   */
  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);
  
  // 楽天市場商品データまたはpropsから渡された商品データを使用
  const catalog = currentProducts.length > 0 ? currentProducts : (products || []);

  // ===== カスタムフック =====
  
  const { state, dispatch } = useSuppliesState({
    initialEvacueeCount,
    initialTargetDays,
    catalog
  });

  const { productMap, grouped, selectedIds } = useProductCatalog(catalog, state.rows);
  const { validateAndCreatePayload } = useNeedsListValidation(productMap, DRONE_MAX_PAYLOAD_G);

  // ===== 計算処理 =====
  
  /**
   * 優先度順ソート（表示用）
   * high → medium → low の順でソート
   */
  const sortedRows = useMemo(() => {
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return [...state.rows].sort((a, b) => rank[a.priority] - rank[b.priority]);
  }, [state.rows]);

  /**
   * サマリー計算
   * 総数量、総重量、水のケース数を計算
   */
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

  // ===== イベントハンドラー =====
  
  /**
   * 商品変更ハンドラー
   * 重複チェックを行ってから商品を変更
   */
  const handleProductChange = useCallback((rowId: string, newId: string) => {
    const usedByOther = state.rows.some((rr: NeedRow) => rr.id !== rowId && rr.productId === newId);
    if (usedByOther) {
      alert("この商品は既に他の行で選択されています。");
      return;
    }
    dispatch({ type: 'UPDATE_ROW', payload: { id: rowId, updates: { productId: newId } } });
  }, [state.rows, dispatch]);

  /**
   * 行追加ハンドラー
   * 未使用の商品を自動選択して新しい行を追加
   */
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

  /**
   * 行削除ハンドラー
   * 最低1行は残すように制限
   */
  const handleRemoveRow = useCallback((id: string) => {
    if (state.rows.length > 1) {
      dispatch({ type: 'REMOVE_ROW', payload: id });
    }
  }, [state.rows.length, dispatch]);

  const handleSave = useCallback(async () => {
    const payload = validateAndCreatePayload(state);
    if (!payload) return;

    const shelterId = Number(params?.id);
    if (!Number.isFinite(shelterId) || shelterId <= 0) {
      alert("URLの避難所IDが不正です");
      return;
    }

    // バックエンドは priority: 'high'|'medium'|'low', category: '医薬品'|'衛生'|'食料'|'生活用品' の文字列をそのまま受け取る

    const body: NeedsListDto = {
      shelterId,
      evacueeCount: payload.evacueeCount,
      targetDays: payload.targetDays,
      totalUnits: payload.analytics.totals.units,
      totalWeightGrams: payload.analytics.totals.weightGrams,
      waterCases: payload.analytics.totals.waterCases,
      items: payload.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        unit: it.unit,
        category: it.category,
        quantity: it.quantity,
        priority: it.priority,
        notes: it.notes,
        perUnitWeightGrams: it.perUnitWeightGrams,
        totalWeightGrams: it.totalWeightGrams,
        droneEligible: it.droneEligible,
        droneEligibleWholeOrder: it.droneEligibleWholeOrder,
        dronePerUnitEligible: it.dronePerUnitEligible,
        droneUnitsPerFlight: it.droneUnitsPerFlight ?? 0,
        droneFlightsRequired: it.droneFlightsRequired ?? 0,
      })),
    };

    dispatch({ type: 'SET_SAVING', payload: true });
    (onSubmit ? Promise.resolve(onSubmit(payload)) : Promise.resolve())
      .then(() => createNeedsList(body))
      .then(() => {
        router.push(`/shelter/${shelterId}/home`);
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "保存に失敗しました";
        alert(`エラー: ${message}`);
      })
      .finally(() => {
        dispatch({ type: 'SET_SAVING', payload: false });
      });
  }, [state, validateAndCreatePayload, onSubmit, dispatch, params?.id, router]);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-4 mb-6">
          <BackButton fallbackHref={`/shelter/${params?.id}/home`} />
        </div>
        {/* ヒーローセクション */}
        <HeroSection 
          evacueeCount={state.evacueeCount}
          targetDays={state.targetDays}
          onEvacueeCountChange={(value) => dispatch({ type: 'SET_EVACUEE_COUNT', payload: value })}
          onTargetDaysChange={(value) => dispatch({ type: 'SET_TARGET_DAYS', payload: value })}
        />

        {/* 楽天市場商品データ管理 */}
        <section className="mx-auto max-w-7xl py-6">
          <RakutenProductManager
            onProductsReady={handleProductsReady}
            onDatabaseProductsReady={handleDatabaseProductsReady}
            onLoadingChange={handleLoadingChange}
          />
        </section>

        {/* 商品カードグリッド */}
        <section className="mx-auto max-w-7xl pb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">必要物資リスト</h2>
            <p className="text-sm text-foreground/70">避難所の必要物資を管理し、効率的な支援を実現します</p>
            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700">楽天市場から商品データを取得中...</span>
                </div>
              </div>
            )}
          </div>
          
          {catalog.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-lg font-medium">商品データを読み込み中...</p>
                <p className="text-sm">楽天市場から商品情報を取得しています</p>
              </div>
            </div>
          ) : (
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
          )}

          {/* 追加ボタン */}
          <div className="mt-12 text-center">
            <button
              onClick={handleAddRow}
              className="btn btn-primary inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base"
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
