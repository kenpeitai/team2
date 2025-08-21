import React from "react";
import { RAKUTEN_RED, RAKUTEN_RED_HOVER } from "../constants";

interface SummaryBarProps {
  totals: {
    units: number;
    weightKg: number;
    waterCases: number;
  };
  saving: boolean;
  onApplyRecommendAll: () => void;
  onSave: () => void;
}

export function SummaryBar({
  totals,
  saving,
  onApplyRecommendAll,
  onSave
}: SummaryBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/10 dark:border-white/20 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* 左側: 統計情報 */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-foreground/5 rounded-md">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground/70">総数量</p>
                <p className="text-xl font-bold text-foreground">{totals.units.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-foreground/5 rounded-md">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground/70">総重量</p>
                <p className="text-xl font-bold text-foreground">{totals.weightKg.toFixed(1)} kg</p>
              </div>
            </div>
            
            {totals.waterCases > 0 && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground/5 rounded-md">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">水のケース</p>
                  <p className="text-xl font-bold text-foreground">{totals.waterCases}</p>
                </div>
              </div>
            )}
          </div>

          {/* 右側: アクションボタン */}
          <div className="flex items-center gap-4">
            <button
              onClick={onApplyRecommendAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/5 text-foreground font-medium rounded-md border border-black/10 dark:border-white/20 hover:bg-foreground/10 transition-colors duration-200"
              title="全行に推奨数量を適用"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              推奨数量を一括適用
            </button>
            
            <button
              onClick={onSave}
              disabled={saving}
              className="btn btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  リストを保存
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
