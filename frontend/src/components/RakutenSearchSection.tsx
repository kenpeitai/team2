"use client";
import React, { useState, useCallback } from 'react';
import { getCheapestItemByKeyword, getItemsByKeyword, RakutenItem } from '@/lib/api/rakuten';
import { RakutenItemCard } from './RakutenItemCard';

interface RakutenSearchSectionProps {
  onItemSelect?: (item: RakutenItem) => void;
  showSelectButton?: boolean;
  title?: string;
  description?: string;
}

export function RakutenSearchSection({
  onItemSelect,
  showSelectButton = false,
  title = "楽天市場で商品を検索",
  description = "商品名や型番を入力して、楽天市場の最安値商品を検索できます"
}: RakutenSearchSectionProps) {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState<RakutenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'single' | 'multiple'>('single');

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) {
      setError('キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let results: RakutenItem[] = [];
      
      if (searchMode === 'single') {
        const item = await getCheapestItemByKeyword(keyword);
        if (item) {
          results = [item];
        }
      } else {
        results = await getItemsByKeyword(keyword, 10);
      }

      setItems(results);
      
      if (results.length === 0) {
        setError('該当する商品が見つかりませんでした。キーワードを変更してお試しください。');
      }
    } catch (err) {
      setError('検索中にエラーが発生しました。しばらく時間をおいてから再度お試しください。');
      console.error('楽天市場検索エラー:', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, searchMode]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleItemSelect = useCallback((item: RakutenItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  }, [onItemSelect]);

  return (
    <div className={`${title ? 'bg-white border border-gray-200 rounded-lg p-6' : ''}`}>
      {/* ヘッダー */}
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}

              {/* 検索フォーム */}
        <div className={`${title ? 'mb-6' : 'mb-4'}`}>
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="商品名や型番を入力"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>

        {/* 検索モード選択 */}
        <div className="flex gap-3 text-xs">
          <label className="flex items-center">
            <input
              type="radio"
              value="single"
              checked={searchMode === 'single'}
              onChange={(e) => setSearchMode(e.target.value as 'single' | 'multiple')}
              className="mr-1"
            />
            最安値1件
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="multiple"
              checked={searchMode === 'multiple'}
              onChange={(e) => setSearchMode(e.target.value as 'single' | 'multiple')}
              className="mr-1"
            />
            複数件表示
          </label>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className={`${title ? 'mb-6' : 'mb-3'} p-3 bg-red-50 border border-red-200 rounded-md`}>
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* 検索結果 */}
      {items.length > 0 && (
        <div>
          <h4 className={`${title ? 'text-md' : 'text-sm'} font-medium text-gray-900 mb-3`}>
            検索結果 ({items.length}件)
          </h4>
          <div className={`grid gap-3 ${title ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {items.map((item, index) => (
              <RakutenItemCard
                key={`${item.name}-${index}`}
                item={item}
                onSelect={handleItemSelect}
                showSelectButton={showSelectButton}
              />
            ))}
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 text-sm">検索中...</span>
        </div>
      )}
    </div>
  );
}
