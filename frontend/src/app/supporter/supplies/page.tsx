"use client";
import React, { useMemo, useState, useEffect } from "react";
import Layout from '@/components/Layout';

// ===== Rakutenブランドカラー定義 =====
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#A80000";

// ===== 型定義 =====
export type Priority = "high" | "medium" | "low";
export type Category = "医薬品" | "衛生" | "食料" | "生活用品";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
}

export interface NeedsListPayload {
  shelterName: string;
  evacueeCount: number;
  targetDays: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unit: string;
    quantity: number;
    priority: Priority;
    category: Category;
    notes?: string;
    imageUrl?: string;
    estimatedPrice?: number;
  }>;
}

// ===== モックデータ (NeedsListFormのカタログ情報を反映) =====
const MOCK_SHELTER_DATA: NeedsListPayload = {
  shelterName: "中村スポーツセンター",
  evacueeCount: 85,
  targetDays: 5,
  items: [
    {
      id: "1",
      productId: "p-water-2l", // IDをカタログに合わせた
      productName: "飲料水 2L×6本（1ケース）", // 名称をカタログに合わせた
      unit: "ケース",
      quantity: 43, // おすすめ数量を反映
      priority: "high" as Priority,
      category: "食料" as Category,
      // 画像URLを商品に合わせて変更
      imageUrl: "https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop",
      estimatedPrice: 1000
    },
    {
      id: "2",
      productId: "p-instant-rice", // IDをカタログに合わせた
      productName: "サトウのごはん 200g×5食", // 名称をカタログに合わせた
      unit: "箱",
      quantity: 85, // おすすめ数量を反映
      priority: "high" as Priority,
      category: "食料" as Category,
      // 画像URLを商品に合わせて変更
      imageUrl: "https://images.unsplash.com/photo-1625944239923-199539420757?w=300&h=200&fit=crop",
      estimatedPrice: 600
    },
    {
      id: "3",
      productId: "m-bandaids", // IDをカタログに合わせた
      productName: "ばんそうこう（アソート20枚）", // 名称をカタログに合わせた
      unit: "箱",
      quantity: 9, // おすすめ数量を反映
      priority: "high" as Priority,
      category: "医薬品" as Category,
      // 画像URLを商品に合わせて変更
      imageUrl: "https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop",
      estimatedPrice: 400
    },
    {
      id: "4",
      productId: "p-blanket", // IDをカタログに合わせた
      productName: "毛布", // 名称をカタログに合わせた
      unit: "枚",
      quantity: 85,
      priority: "medium" as Priority,
      category: "生活用品" as Category,
      // 画像URLを商品に合わせて変更
      imageUrl: "https://images.unsplash.com/photo-1580301762319-24b4f3568c07?w=300&h=200&fit=crop",
      estimatedPrice: 1500
    },
    {
      id: "5",
      productId: "p-mask", // IDをカタログに合わせた
      productName: "不織布マスク(50枚)", // 名称をカタログに合わせた
      unit: "箱",
      quantity: 22, // おすすめ数量を反映
      priority: "medium" as Priority,
      category: "衛生" as Category,
      // 画像URLを商品に合わせて変更
      imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&h=200&fit=crop",
      estimatedPrice: 400
    },
  ]
};

// ===== メインコンポーネント =====
export default function SupporterDonationPage() {
  const [needsList, setNeedsList] = useState<NeedsListPayload | null>(null);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // データ読み込みシミュレーション
  useEffect(() => {
    const loadShelterData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNeedsList(MOCK_SHELTER_DATA);
      } catch (err) {
        setError("避難所情報の取得に失敗しました。");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadShelterData();
  }, []);

  const sortedItems = useMemo(() => {
    if (!needsList) return [];
    const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return [...needsList.items].sort((a, b) => rank[a.priority] - rank[b.priority]);
  }, [needsList]);

  const cartSummary = useMemo(() => {
    let itemCount = 0;
    let estimatedTotal = 0;
    Array.from(cart.values()).forEach(cartItem => {
      itemCount += cartItem.quantity;
      const originalItem = needsList?.items.find(item => item.id === cartItem.id);
      if (originalItem?.estimatedPrice) {
        estimatedTotal += originalItem.estimatedPrice * cartItem.quantity;
      }
    });
    return { itemCount, estimatedTotal };
  }, [cart, needsList]);

  function handleCartChange(item: NeedsListPayload["items"][0], newQuantity: number) {
    const clampedQuantity = Math.max(0, Math.min(item.quantity, newQuantity));
    const newCart = new Map(cart);
    if (clampedQuantity > 0) {
      newCart.set(item.id, {
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        quantity: clampedQuantity,
        maxQuantity: item.quantity,
        imageUrl: item.imageUrl,
      });
    } else {
      newCart.delete(item.id);
    }
    setCart(newCart);
  }

  async function handleProceed() {
    if (cart.size === 0) {
      alert("支援する商品を選択してください。");
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${cart.size}種類の商品を買い物かごに追加しました！`);
      setCart(new Map());
    } catch (err) {
      alert("エラーが発生しました。");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">避難所情報を読み込んでいます...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !needsList) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <p className="text-gray-600">{error || "データが見つかりません"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              再読み込み
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden pb-24">
        <div className="bg-white border-b py-6 shadow-sm">
          <div className="mx-auto max-w-screen-xl px-4">
            <span className="text-sm text-gray-500 font-medium">支援先</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">{needsList.shelterName}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xl">👥</span>
                  <span className="text-sm font-medium text-blue-600">避難人数</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{needsList.evacueeCount}人</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">📅</span>
                  <span className="text-sm font-medium text-green-600">対象日数</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{needsList.targetDays}日</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-xl">📦</span>
                  <span className="text-sm font-medium text-purple-600">必要品目</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{needsList.items.length}種類</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-screen-xl px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => {
              const cartQuantity = cart.get(item.id)?.quantity ?? 0;
              const isFullyStocked = cartQuantity >= item.quantity;
              const fulfillmentRate = Math.round((cartQuantity / item.quantity) * 100);
              return (
                <article
                  key={item.id}
                  className={`rounded-3xl shadow-sm transition-all duration-200 bg-white border ${
                    isFullyStocked ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-48 w-full object-cover rounded-t-3xl"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E画像なし%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute left-3 top-3">
                      <PriorityChip priority={item.priority} />
                    </div>
                    {isFullyStocked && (
                      <div className="absolute right-3 top-3">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                      <h3 className="font-bold text-lg mt-2 leading-tight">{item.productName}</h3>
                    </div>
                    {item.notes && (
                      <div className="text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <strong>備考:</strong> {item.notes}
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">必要数量</span>
                        <span className="text-xl font-bold">
                          {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                        </span>
                      </div>
                      {item.estimatedPrice && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">参考価格</span>
                          <span className="text-sm font-medium">¥{item.estimatedPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">達成率</span>
                        <span className={`font-medium ${isFullyStocked ? 'text-green-600' : 'text-blue-600'}`}>
                          {fulfillmentRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${isFullyStocked ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(fulfillmentRate, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">支援する数量</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={cart.get(item.id)?.quantity ?? 0}
                            onChange={(e) => handleCartChange(item, parseInt(e.target.value, 10) || 0)}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-lg font-bold focus:border-blue-500 focus:ring-0"
                            aria-label="支援数量"
                          />
                        </div>
                        <span className="text-sm text-gray-500 min-w-0">{item.unit}</span>
                      </div>
                      {isFullyStocked && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <span className="text-green-600">✓</span>
                          必要数が満たされました！
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {cart.size > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
            <div className="mx-auto max-w-screen-xl px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">🛒</span>
                    <span className="font-semibold">{cart.size}</span>
                    <span className="text-sm">種類選択中</span>
                  </div>
                  <div className="hidden sm:block text-sm text-gray-600">
                    合計 <span className="font-semibold">{cartSummary.itemCount}</span> 単位
                    {cartSummary.estimatedTotal > 0 && (
                      <span className="ml-2">(約 <span className="font-semibold">¥{cartSummary.estimatedTotal.toLocaleString()}</span>)</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isSubmitting ? '#9ca3af' : RAKUTEN_RED }}
                  onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                  onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>処理中...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 S0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>買い物かごに追加</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function PriorityChip({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; cls: string }> = {
    high:   { label: "高", cls: "bg-red-100 text-red-700 ring-red-300 ring-1" },
    medium: { label: "中", cls: "bg-amber-100 text-amber-700 ring-amber-300 ring-1" },
    low:    { label: "低", cls: "bg-emerald-100 text-emerald-700 ring-emerald-300 ring-1" },
  };
  const v = map[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-inset ${v.cls}`}>
      優先度 {v.label}
    </span>
  );
}