"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import SupporterLayout from '@/components/SupporterLayout';
import BackButton from '@/components/BackButton';
import { addItemToCart } from '@/lib/api/cart';

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

// ===== モックデータ =====
const shelterDataMap: Record<string, NeedsListPayload> = {
  "1": {
    shelterName: "中央避難所",
    evacueeCount: 150,
    targetDays: 3,
    items: [
      {
        id: "1",
        productId: "p-water-2l",
        productName: "飲料水 2L×6本（1ケース）",
        unit: "ケース",
        quantity: 43,
        priority: "high" as Priority,
        category: "食料" as Category,
        notes: "生命維持に不可欠",
        imageUrl: "https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop",
        estimatedPrice: 1000
      },
      {
        id: "2",
        productId: "p-instant-rice",
        productName: "サトウのごはん 200g×5食",
        unit: "箱",
        quantity: 85,
        priority: "high" as Priority,
        category: "食料" as Category,
        notes: "主食として重要",
        imageUrl: "https://images.unsplash.com/photo-1625944239923-199539420757?w=300&h=200&fit=crop",
        estimatedPrice: 600
      },
      {
        id: "3",
        productId: "m-bandaids",
        productName: "ばんそうこう（アソート20枚）",
        unit: "箱",
        quantity: 9,
        priority: "high" as Priority,
        category: "医薬品" as Category,
        notes: "怪我の手当に",
        imageUrl: "https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop",
        estimatedPrice: 400
      }
    ]
  },
  "2": {
    shelterName: "北区避難所",
    evacueeCount: 80,
    targetDays: 5,
    items: [
      {
        id: "1",
        productId: "p-water-2l",
        productName: "飲料水 2L×6本（1ケース）",
        unit: "ケース",
        quantity: 75,
        priority: "high" as Priority,
        category: "食料" as Category,
        notes: "生命維持に不可欠",
        imageUrl: "https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop",
        estimatedPrice: 1000
      },
      {
        id: "2",
        productId: "p-blanket",
        productName: "毛布",
        unit: "枚",
        quantity: 150,
        priority: "high" as Priority,
        category: "生活用品" as Category,
        notes: "夜間の冷え込み対策",
        imageUrl: "https://images.unsplash.com/photo-1580301762319-24b4f3568c07?w=300&h=200&fit=crop",
        estimatedPrice: 1500
      },
      {
        id: "3",
        productId: "m-bandaids",
        productName: "ばんそうこう（アソート20枚）",
        unit: "箱",
        quantity: 15,
        priority: "medium" as Priority,
        category: "医薬品" as Category,
        notes: "怪我の手当に",
        imageUrl: "https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop",
        estimatedPrice: 400
      }
    ]
  },
  "3": {
    shelterName: "南区避難所",
    evacueeCount: 120,
    targetDays: 4,
    items: [
      {
        id: "1",
        productId: "p-mask",
        productName: "不織布マスク(50枚)",
        unit: "箱",
        quantity: 20,
        priority: "high" as Priority,
        category: "衛生" as Category,
        notes: "感染症対策に",
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&h=200&fit=crop",
        estimatedPrice: 400
      },
      {
        id: "2",
        productId: "m-ors-500",
        productName: "経口補水液 500mL（1本）",
        unit: "本",
        quantity: 156,
        priority: "medium" as Priority,
        category: "医薬品" as Category,
        notes: "脱水症状の際に",
        imageUrl: "https://images.unsplash.com/photo-1604176422213-92e420a67118?w=300&h=200&fit=crop",
        estimatedPrice: 200
      }
    ]
  }
};

// 默认数据（当避难所ID不存在时）
const DEFAULT_SHELTER_DATA: NeedsListPayload = {
  shelterName: "避難所",
  evacueeCount: 50,
  targetDays: 3,
  items: [
    {
      id: "1",
      productId: "p-water-2l",
      productName: "飲料水 2L×6本（1ケース）",
      unit: "ケース",
      quantity: 25,
      priority: "high" as Priority,
      category: "食料" as Category,
      notes: "生命維持に不可欠",
      imageUrl: "https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop",
      estimatedPrice: 1000
    }
  ]
};

const getShelterData = (shelterId: string): NeedsListPayload => {
  return shelterDataMap[shelterId] || DEFAULT_SHELTER_DATA;
};

// 将日文category转换为英文
const getCategoryInEnglish = (category?: string): string => {
  switch (category) {
    case "食料": return "FOOD";
    case "医薬品": return "MEDICINE";
    case "衛生": return "HYGIENE";
    case "生活用品": return "LIVING_SUPPLIES";
    default: return "OTHER";
  }
};

// ===== メインコンポーネント =====
export default function SupporterDonationPage() {
  const params = useParams();
  const shelterId = params.shelter_id as string;
  const supporterId = params.id as string;
  
  const [needsList, setNeedsList] = useState<NeedsListPayload | null>(null);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [editingQty, setEditingQty] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // データ読み込みシミュレーション
  useEffect(() => {
    const loadShelterData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // 根据避难所ID获取对应的数据
        const shelterData = getShelterData(shelterId);
        setNeedsList(shelterData);
      } catch (err) {
        setError("避難所情報の取得に失敗しました。");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadShelterData();
  }, [shelterId]);

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

    if (isSubmitting) {
      return; // 防止重复提交
    }

    console.log("开始处理购物车...");
    console.log("购物车大小:", cart.size);
    console.log("supporterId:", supporterId);
    console.log("shelterId:", shelterId);

    setIsSubmitting(true);
    try {
      // 将购物车商品添加到数据库
      const cartItems = Array.from(cart.values());
      console.log("准备添加到购物车的商品:", cartItems);
      
      // 使用for循环而不是Promise.all，避免并发问题
      for (const item of cartItems) {
        const needsItem = needsList?.items.find(needsItem => needsItem.id === item.id);
        const cartItemData = {
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          category: getCategoryInEnglish(needsItem?.category) || "OTHER",
          quantity: item.quantity,
          pricePerUnit: needsItem?.estimatedPrice || 0,
          totalPrice: (needsItem?.estimatedPrice || 0) * item.quantity,
          notes: needsItem?.notes || ""
        };
        console.log("发送到API的数据:", cartItemData);
        console.log("API URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/cart/${supporterId}/${shelterId}/items`);
        await addItemToCart(parseInt(supporterId), parseInt(shelterId), cartItemData);
      }
      
      console.log("所有商品已成功添加到购物车");
      
      // 跳转到购物车页面
      window.location.href = `/supporter/${supporterId}/${shelterId}/shopping-cart`;
    } catch (err) {
      console.error("购物车处理失败:", err);
      console.error("错误详情:", err);
      console.error("错误类型:", typeof err);
      console.error("错误堆栈:", err instanceof Error ? err.stack : 'No stack trace');
      if (err instanceof Error) {
        alert(`购物车处理失败: ${err.message}`);
      } else {
        alert("购物车处理失败，请重试。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <SupporterLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">避難所情報を読み込んでいます...</p>
          </div>
        </div>
      </SupporterLayout>
    );
  }

  if (error) {
    return (
      <SupporterLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              再読み込み
            </button>
          </div>
        </div>
      </SupporterLayout>
    );
  }

  return (
    <SupporterLayout>
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="mb-4">
                  <BackButton fallbackHref={`/supporter/${supporterId}/home`} />
                </div>
        <div className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-screen-xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{needsList?.shelterName}</h1>
                <p className="text-gray-600 mt-1">
                  避難者数: {needsList?.evacueeCount}人 | 目標日数: {needsList?.targetDays}日
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">支援者ID: {supporterId}</div>
                <div className="text-sm text-gray-500">避難所ID: {shelterId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">支援が必要な物資一覧</h2>
            <p className="text-gray-600">優先度の高い物資から順番に表示されています。</p>
          </div>

          <section className="space-y-6">
            <div className="grid gap-6">
              {sortedItems.map((item) => {
                const cartItem = cart.get(item.id);
                const isFullyStocked = cartItem && cartItem.quantity >= item.quantity;
                
                return (
                  <article key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl || "https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop"}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.productName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <PriorityChip priority={item.priority} />
                              <span className="text-sm text-gray-500">{item.category}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900">{item.quantity}</div>
                            <div className="text-sm text-gray-500">{item.unit}</div>
                          </div>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mb-3">{item.notes}</p>
                        )}
                        {item.estimatedPrice && (
                          <p className="text-sm text-gray-500 mb-3">
                            推定価格: ¥{item.estimatedPrice.toLocaleString()}/{item.unit}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700" htmlFor={`qty-${item.id}`}>支援する数量</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            id={`qty-${item.id}`}
                            type="number"
                            min="0"
                            max={item.quantity}
                            placeholder="0"
                            value={editingQty.get(item.id) ?? String(cart.get(item.id)?.quantity ?? "")}
                            onChange={(e) => {
                              const v = e.target.value;
                              setEditingQty(prev => {
                                const m = new Map(prev);
                                m.set(item.id, v);
                                return m;
                              });
                              if (v === "") return;
                              const n = parseInt(v, 10);
                              if (!Number.isFinite(n) || n < 0) return;
                              handleCartChange(item, n);
                            }}
                            onBlur={() => {
                              const v = editingQty.get(item.id) ?? "";
                              if (v === "") {
                                setEditingQty(prev => {
                                  const m = new Map(prev);
                                  m.set(item.id, "0");
                                  return m;
                                });
                                handleCartChange(item, 0);
                              }
                            }}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-lg font-bold focus:border-blue-500 focus:ring-0"
                            aria-label="支援数量"
                          />
                        </div>
                        <span className="text-sm text-gray-500 min-w-0">{item.unit}</span>
                      </div>
                      {isFullyStocked && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <span className="text-green-600">✓</span>
                          <span>必要数が満たされました！</span>
                        </p>
                      )}
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
                    onFocus={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                    onBlur={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
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
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
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
      </div>
    </SupporterLayout>
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