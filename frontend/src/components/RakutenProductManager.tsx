"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRakutenProducts } from '@/app/shelter/[id]/supplies/hooks/useRakutenProducts';
import { RAKUTEN_PRODUCT_CATALOG } from '@/app/shelter/[id]/supplies/rakutenCatalog';

interface RakutenProductManagerProps {
  onProductsReady: (products: any[]) => void;
  onDatabaseProductsReady?: (products: any[]) => void; // データベース保存用
  onLoadingChange?: (loading: boolean) => void;
}

export function RakutenProductManager({ 
  onProductsReady, 
  onDatabaseProductsReady,
  onLoadingChange 
}: RakutenProductManagerProps) {
  const {
    products,
    isInitialized,
    searchAllProducts,
    getProductsAsArray,
    getProductsForDatabase,
    getSearchStats
  } = useRakutenProducts();

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 初期化時に基本商品データを提供
  useEffect(() => {
    if (isInitialized && !hasSearched) {
      const basicProducts = getProductsAsArray();
      onProductsReady(basicProducts);
      
      // データベース保存用のデータも提供
      if (onDatabaseProductsReady) {
        const databaseProducts = getProductsForDatabase();
        onDatabaseProductsReady(databaseProducts);
      }
    }
  }, [isInitialized, hasSearched, getProductsAsArray, getProductsForDatabase, onProductsReady, onDatabaseProductsReady]);

  // 自動で楽天市場から商品を取得
  useEffect(() => {
    if (isInitialized && !hasSearched) {
      handleSearchAllProducts();
    }
  }, [isInitialized, hasSearched, handleSearchAllProducts]);

  // 楽天市場から全商品を検索
  const handleSearchAllProducts = useCallback(async () => {
    setIsSearching(true);
    onLoadingChange?.(true);
    setHasSearched(true);

    try {
      await searchAllProducts();
      
      // 検索完了後、楽天市場データを含む商品リストを提供
      const updatedProducts = getProductsAsArray();
      console.log('楽天市場検索完了後の商品データ:', updatedProducts);
      onProductsReady(updatedProducts);
      
      // データベース保存用のデータも提供
      if (onDatabaseProductsReady) {
        const databaseProducts = getProductsForDatabase();
        onDatabaseProductsReady(databaseProducts);
      }
    } catch (error) {
      console.error('楽天市場商品検索エラー:', error);
    } finally {
      setIsSearching(false);
      onLoadingChange?.(false);
    }
  }, [searchAllProducts, getProductsAsArray, getProductsForDatabase, onProductsReady, onDatabaseProductsReady, onLoadingChange]);

  // 検索統計を取得
  const stats = getSearchStats();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">楽天市場商品データ</h3>
          <p className="text-sm text-gray-600">
            楽天市場から最安値商品情報を取得して表示します
          </p>
        </div>
        
        <button
          onClick={handleSearchAllProducts}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSearching ? '検索中...' : '楽天市場から商品を取得'}
        </button>
      </div>

      {/* 検索統計 */}
      {hasSearched && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-md">
            <div className="text-2xl font-bold text-gray-600">{stats.idle}</div>
            <div className="text-xs text-gray-500">未検索</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-md">
            <div className="text-2xl font-bold text-blue-600">{stats.loading}</div>
            <div className="text-xs text-blue-500">検索中</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-md">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-xs text-green-500">取得成功</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-md">
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <div className="text-xs text-red-500">エラー</div>
          </div>
        </div>
      )}

      {/* 商品リスト（デバッグ用） */}
      {hasSearched && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">商品検索結果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {Array.from(products.values()).map(product => (
              <div key={product.id} className="p-3 border rounded-md text-xs">
                <div className="font-medium truncate">
                  {product.rakutenItem ? product.rakutenItem.name : product.name}
                </div>
                <div className="text-gray-600">
                  状態: {product.searchStatus}
                </div>
                {product.rakutenId && (
                  <div className="text-purple-600 text-xs">
                    🆔 {product.rakutenId}
                  </div>
                )}
                {product.rakutenItem && (
                  <div className="text-green-600">
                    ¥{product.rakutenItem.price.toLocaleString()} - {product.rakutenItem.shop}
                  </div>
                )}
                {product.rakutenItem?.image && (
                  <div className="text-blue-600 text-xs">
                    📷 画像あり: {product.rakutenItem.image.substring(0, 50)}...
                  </div>
                )}
                {product.rakutenItem?.itemCode && (
                  <div className="text-orange-600 text-xs">
                    🏷️ 商品コード: {product.rakutenItem.itemCode}
                  </div>
                )}
                {product.searchStatus === 'error' && (
                  <div className="text-red-600">
                    検索失敗
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 注意事項 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-yellow-800">
          <strong>注意:</strong> 楽天市場APIには利用制限があります。大量の商品を一度に検索する場合は、
          時間をかけて順次処理されます。検索結果は楽天市場の在庫状況により変動する場合があります。
        </p>
      </div>
    </div>
  );
}
