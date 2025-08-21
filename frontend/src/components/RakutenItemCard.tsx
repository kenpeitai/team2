import React from 'react';
import { RakutenItem } from '@/lib/api/rakuten';

interface RakutenItemCardProps {
  item: RakutenItem;
  onSelect?: (item: RakutenItem) => void;
  showSelectButton?: boolean;
}

export function RakutenItemCard({ item, onSelect, showSelectButton = false }: RakutenItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP').format(price);
  };

  const formatRating = (rating?: number) => {
    if (!rating) return null;
    return rating.toFixed(1);
  };

  // ProductCard内で使用される場合はよりコンパクトなスタイルを適用
  const isCompact = !showSelectButton;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${isCompact ? 'text-xs' : ''}`}>
      {/* 商品画像 */}
      <div className={`${isCompact ? 'h-20' : 'aspect-square'} bg-gray-100 flex items-center justify-center`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${item.image ? 'hidden' : ''} flex items-center justify-center w-full h-full`}>
          <svg className={`${isCompact ? 'w-6 h-6' : 'w-12 h-12'} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* 商品情報 */}
      <div className={`${isCompact ? 'p-2' : 'p-4'}`}>
        {/* 商品名 */}
        <h3 className={`font-medium text-gray-900 ${isCompact ? 'text-xs' : 'text-sm'} line-clamp-2 mb-2 ${isCompact ? 'min-h-[2rem]' : 'min-h-[2.5rem]'}`}>
          {item.name}
        </h3>

        {/* 価格 */}
        <div className="flex items-center justify-between mb-2">
          <span className={`${isCompact ? 'text-sm' : 'text-lg'} font-bold text-red-600`}>
            ¥{formatPrice(item.price)}
          </span>
          {item.rating && (
            <div className={`flex items-center ${isCompact ? 'text-xs' : 'text-sm'} text-gray-600`}>
              <span className="text-yellow-400 mr-1">★</span>
              <span>{formatRating(item.rating)}</span>
              {item.reviews && (
                <span className="text-gray-400 ml-1">({item.reviews})</span>
              )}
            </div>
          )}
        </div>

        {/* ショップ名 */}
        <p className={`${isCompact ? 'text-xs' : 'text-xs'} text-gray-600 ${isCompact ? 'mb-2' : 'mb-3'} truncate`}>
          {item.shop}
        </p>

        {/* 選択ボタン */}
        {showSelectButton && onSelect && (
          <button
            onClick={() => onSelect(item)}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${isCompact ? 'text-xs' : 'text-sm'} font-medium py-2 px-4 rounded-md transition-colors duration-200`}
          >
            この商品を選択
          </button>
        )}

        {/* 楽天市場で見るボタン */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-center ${isCompact ? 'text-xs' : 'text-sm'} font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
            showSelectButton && onSelect
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 mt-2'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          楽天市場で見る
        </a>
      </div>
    </div>
  );
}
