"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import SupporterLayout from '@/components/SupporterLayout';
<<<<<<< HEAD
import { addItemToCart, getCart } from '@/lib/api/cart';
import { getLatestNeedsListByShelter } from '@/lib/api/supplies';
import type { NeedsListDto, NeedsListItemDto } from '@/types/api';
=======
import BackButton from '@/components/BackButton';
import { addItemToCart } from '@/lib/api/cart';
>>>>>>> origin/main

// ===== Rakutenブランドカラー定義 =====
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#A80000";

// ===== 型定義 =====
export type Priority = "HIGH" | "MEDIUM" | "LOW";
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

// 前端显示用的数据结构
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

// ===== データ変換関数 =====
const convertNeedsListDtoToPayload = (needsListDto: NeedsListDto, shelterName: string): NeedsListPayload => {
  return {
    shelterName: shelterName,
    evacueeCount: needsListDto.evacueeCount || 0,
    targetDays: needsListDto.targetDays || 0,
    items: (needsListDto.items || []).map((item: NeedsListItemDto) => ({
      id: item.id?.toString() || '',
      productId: item.productId,
      productName: item.productName,
      unit: item.unit,
      quantity: item.quantity,
      priority: item.priority as Priority,
      category: convertCategoryToJapanese(item.category),
      notes: item.notes,
      imageUrl: getProductImageUrl(item.productId),
      estimatedPrice: calculateEstimatedPrice(item.productId, item.quantity)
    }))
  };
};

// カテゴリを日本語に変換
const convertCategoryToJapanese = (category: string): Category => {
  switch (category) {
    case "FOOD": return "食料";
    case "MEDICINE": return "医薬品";
    case "HYGIENE": return "衛生";
    case "LIVING_SUPPLIES": return "生活用品";
    default: return "食料";
  }
};

// 商品画像URLを取得
const getProductImageUrl = (productId: string): string => {
  // 商品IDに基づいて画像URLを返す
  const imageMap: Record<string, string> = {
    'p-water-2l': 'https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop',
    'p-instant-rice': 'https://images.unsplash.com/photo-1625944239923-199539420757?w=300&h=200&fit=crop',
    'p-canned-food': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
    'p-bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
    'p-cup-noodle': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
    'p-blanket': 'https://images.unsplash.com/photo-1580301762319-24b4f3568c07?w=300&h=200&fit=crop',
    'p-battery-aa': 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=300&h=200&fit=crop',
    'p-flashlight': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    'p-radio': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
    'p-sleeping-bag': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop',
    'p-mask': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&h=200&fit=crop',
    'p-toilet-paper': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=200&fit=crop',
    'p-wet-tissue': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    'p-soap': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    'p-toothbrush': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    'm-acetaminophen': 'https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop',
    'm-ibuprofen': 'https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop',
    'm-cold-combo': 'https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop',
    'm-antihistamine': 'https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop',
    'm-anti-diarrhea': 'https://images.unsplash.com/photo-1599427382433-03e08b1a2a1d?w=300&h=200&fit=crop'
  };
  return imageMap[productId] || 'https://images.unsplash.com/photo-1556812235-a13b64175933?w=300&h=200&fit=crop';
};

// 推定価格を計算
const calculateEstimatedPrice = (productId: string, quantity: number): number => {
  const priceMap: Record<string, number> = {
    'p-water-2l': 1000,
    'p-instant-rice': 600,
    'p-canned-food': 300,
    'p-bread': 200,
    'p-cup-noodle': 150,
    'p-blanket': 1500,
    'p-battery-aa': 500,
    'p-flashlight': 800,
    'p-radio': 2000,
    'p-sleeping-bag': 3000,
    'p-mask': 400,
    'p-toilet-paper': 300,
    'p-wet-tissue': 200,
    'p-soap': 100,
    'p-toothbrush': 150,
    'm-acetaminophen': 400,
    'm-ibuprofen': 450,
    'm-cold-combo': 500,
    'm-antihistamine': 350,
    'm-anti-diarrhea': 300
  };
  return priceMap[productId] || 500;
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

  // データ読み込み関数
  const loadShelterData = async () => {
    try {
      setIsLoading(true);
      
      // APIから避難所の最新の必要物資リストを取得
      const needsListDto = await getLatestNeedsListByShelter(parseInt(shelterId));
      
      // 避難所名を取得（仮の実装、後で避難所APIから取得するように改善）
      const shelterNames: Record<string, string> = {
        "1": "中央避難所",
        "2": "北区避難所", 
        "3": "南区避難所"
      };
      const shelterName = shelterNames[shelterId] || "避難所";
      
      // DTOをフロントエンド用のデータ構造に変換
      const shelterData = convertNeedsListDtoToPayload(needsListDto, shelterName);
      setNeedsList(shelterData);
    } catch (err) {
      setError("避難所情報の取得に失敗しました。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // データ読み込み
  useEffect(() => {
    loadShelterData();
  }, [shelterId]);

  const sortedItems = useMemo(() => {
    if (!needsList) return [];
    const rank: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
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
                <button
                  onClick={loadShelterData}
                  disabled={isLoading}
                  className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '更新中...' : '🔄 更新'}
                </button>
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
                    className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
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
    HIGH:   { label: "高", cls: "bg-red-100 text-red-700 ring-red-300 ring-1" },
    MEDIUM: { label: "中", cls: "bg-amber-100 text-amber-700 ring-amber-300 ring-1" },
    LOW:    { label: "低", cls: "bg-emerald-100 text-emerald-700 ring-emerald-300 ring-1" },
  };
  const v = map[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-inset ${v.cls}`}>
      優先度 {v.label}
    </span>
  );
}