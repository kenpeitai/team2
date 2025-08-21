"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRakutenProducts } from '@/app/shelter/[id]/supplies/hooks/useRakutenProducts';
import { RAKUTEN_PRODUCT_CATALOG } from '@/app/shelter/[id]/supplies/rakutenCatalog';
import { checkRakutenApiStatus } from '@/lib/api/rakuten';

// ===== 型定義 =====

interface RakutenProductManagerProps {
  onProductsReady: (products: any[]) => void;
  onDatabaseProductsReady?: (products: any[]) => void; // データベース保存用
  onLoadingChange?: (loading: boolean) => void;
}

// ===== メインコンポーネント =====

/**
 * 楽天市場商品データ管理コンポーネント
 * 楽天市場APIから商品情報を取得し、表示用とデータベース保存用の両方のデータを提供
 */
export function RakutenProductManager({ 
  onProductsReady, 
  onDatabaseProductsReady,
  onLoadingChange 
}: RakutenProductManagerProps) {
  // ===== 状態管理 =====
  const {
    products,
    isInitialized,
    searchAllProducts,
    getProductsAsArray,
    getProductsForDatabase,
    getSearchStats
  } = useRakutenProducts(onProductsReady);

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    isAvailable: boolean;
    remainingRequests?: number;
    resetTime?: string;
    error?: string;
  } | null>(null);

  // ===== イベントハンドラー =====
  
  /**
   * 楽天市場から全商品を検索
   * 検索完了後に表示用とデータベース保存用の両方のデータを提供
   */
  const handleSearchAllProducts = useCallback(async () => {
    setIsSearching(true);
    onLoadingChange?.(true);
    setHasSearched(true);

    try {
      await searchAllProducts();
      
      // 状態更新の完了を待つ（より長い時間）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 検索完了後、楽天市場データを含む商品リストを提供
      const updatedProducts = getProductsAsArray();
      onProductsReady(updatedProducts);
      
      // データベース保存用のデータも提供
      if (onDatabaseProductsReady) {
        const databaseProducts = getProductsForDatabase();
        onDatabaseProductsReady(databaseProducts);
      }
      
    } catch (error) {
      // エラーハンドリング
    } finally {
      setIsSearching(false);
      onLoadingChange?.(false);
    }
  }, [searchAllProducts, getProductsAsArray, getProductsForDatabase, onProductsReady, onDatabaseProductsReady, onLoadingChange]);

  // ===== 初期化処理 =====
  
  /**
   * 統合された初期化処理
   * 基本商品データの提供 → API状況確認 → 楽天市場データ取得
   */
  useEffect(() => {
    const initializeProducts = async () => {
      if (!isInitialized || hasSearched) return;
      
      // まず基本商品データを提供（即座に表示）
      const basicProducts = getProductsAsArray();
      onProductsReady(basicProducts);
      
      // データベース保存用のデータも提供
      if (onDatabaseProductsReady) {
        const databaseProducts = getProductsForDatabase();
        onDatabaseProductsReady(databaseProducts);
      }
      
      // API状況を確認
      const status = await checkRakutenApiStatus();
      setApiStatus(status);
      
      // APIが利用可能な場合は楽天市場からデータを取得
      if (status.isAvailable) {
        await handleSearchAllProducts();
      }
    };
    
    initializeProducts();
  }, [isInitialized, hasSearched, getProductsAsArray, getProductsForDatabase, onProductsReady, onDatabaseProductsReady, handleSearchAllProducts]);

  // ===== 統計データ =====
  const stats = getSearchStats();

  // ===== レンダリング =====
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">楽天市場商品データ</h3>
          <p className="text-sm text-gray-600">
            楽天市場から最安値商品情報を取得して表示します
          </p>
        </div>
        
        {/* 操作ボタン */}
        <div className="flex gap-2">
          <button
            onClick={handleSearchAllProducts}
            disabled={isSearching || !apiStatus?.isAvailable}
            className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSearching ? '検索中...' : '楽天市場から商品を取得'}
          </button>
        </div>
      </div>
    </div>
  );
}
