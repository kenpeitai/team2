"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from 'next/navigation';
import { getCart, updateCartItemQuantity, removeItemFromCart, clearCart as clearCartApi } from '@/lib/api/cart';
import { createOrder } from '@/lib/api/orders';
import SupporterLayout from '@/components/SupporterLayout';
import BackButton from '@/components/BackButton';

/* ====== 型（このファイル内で完結） ====== */
type Yen = number;
type CartItem = {
  productId: string;     // 例: "p-water-2l"
  productName: string;   // 表示名
  unit: string;          // 例）箱, ケース
  quantity: number;
  unitPriceYen?: Yen;
  imageUrl?: string;     // 明示URLがあれば最優先
};
type SupporterCart = { updatedAtISO: string; items: CartItem[] };

/* ====== 設定 ====== */
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";
const fmtJPY = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }) : "—";

/* ====== ページ本体 ====== */
export default function SupporterShoppingCartPage() {
  const params = useParams();
  const supporterId = params.id as string;
  const shelterId = params.shelter_id as string;
  
  const [cart, setCart] = useState<SupporterCart>({ updatedAtISO: new Date().toISOString(), items: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 从数据库加载购物车数据
  useEffect(() => {
    const loadCartFromDatabase = async () => {
      try {
        setLoading(true);
        const cartData = await getCart(parseInt(supporterId), parseInt(shelterId));
        const items: CartItem[] = cartData.items?.map(item => ({
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          quantity: item.quantity,
          unitPriceYen: item.pricePerUnit,
          imageUrl: undefined // 暂时不处理图片
        })) || [];
        
        setCart({
          updatedAtISO: cartData.updatedAt || new Date().toISOString(),
          items
        });
      } catch (error) {
        console.error('Failed to load cart:', error);
        // 如果加载失败，使用空购物车
        setCart({ updatedAtISO: new Date().toISOString(), items: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCartFromDatabase();
  }, [supporterId, shelterId]);

  // 操作
  const updateQty = async (id: string, qty: number) => {
    const newQty = Math.max(0, Math.floor(qty));
    try {
      if (newQty === 0) {
        await removeItemFromCart(parseInt(supporterId), parseInt(shelterId), id);
        // 从本地状态中移除商品
        setCart(prevCart => ({
          ...prevCart,
          items: prevCart.items.filter(item => item.productId !== id),
          updatedAtISO: new Date().toISOString()
        }));
      } else {
        await updateCartItemQuantity(parseInt(supporterId), parseInt(shelterId), id, newQty);
        // 更新本地状态中的数量
        setCart(prevCart => ({
          ...prevCart,
          items: prevCart.items.map(item => 
            item.productId === id ? { ...item, quantity: newQty } : item
          ),
          updatedAtISO: new Date().toISOString()
        }));
      }
    } catch (error) {
             console.error('Failed to update quantity:', error);
       alert('数量の更新に失敗しました。');
       // 更新に失敗した場合、カートデータを再読み込み
      const cartData = await getCart(parseInt(supporterId), parseInt(shelterId));
      const items: CartItem[] = cartData.items?.map(item => ({
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        quantity: item.quantity,
        unitPriceYen: item.pricePerUnit,
        imageUrl: undefined
      })) || [];
      
      setCart({
        updatedAtISO: cartData.updatedAt || new Date().toISOString(),
        items
      });
    }
  };
  
  const removeItem = async (id: string) => {
    try {
      await removeItemFromCart(parseInt(supporterId), parseInt(shelterId), id);
      
      // 从本地状态中移除商品
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.productId !== id),
        updatedAtISO: new Date().toISOString()
      }));
    } catch (error) {
             console.error('Failed to remove item:', error);
       alert('商品の削除に失敗しました。');
       // 削除に失敗した場合、カートデータを再読み込み
      const cartData = await getCart(parseInt(supporterId), parseInt(shelterId));
      const items: CartItem[] = cartData.items?.map(item => ({
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        quantity: item.quantity,
        unitPriceYen: item.pricePerUnit,
        imageUrl: undefined
      })) || [];
      
      setCart({
        updatedAtISO: cartData.updatedAt || new Date().toISOString(),
        items
      });
    }
  };
  
  const clearAll = async () => {
    if (confirm("カートを空にしますか？")) {
      try {
        await clearCartApi(parseInt(supporterId), parseInt(shelterId));
        setCart({ updatedAtISO: new Date().toISOString(), items: [] });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('カートのクリアに失敗しました。');
      }
    }
  };

  // チェックアウト
  const onCheckout = async () => {
    if (!cart.items.length) return alert("カートが空です。");
    setSubmitting(true);
    try {
             // 注文データを作成
       const orderData = {
         totalAmount: totals.subtotal,
         status: 'PENDING',
         paymentStatus: 'PENDING',
         items: cart.items.map(item => ({
           productId: item.productId,
           productName: item.productName,
           unit: item.unit,
           category: 'OTHER', // デフォルトカテゴリ
           quantity: item.quantity,
           pricePerUnit: item.unitPriceYen,
           totalPrice: (item.unitPriceYen || 0) * item.quantity
         }))
       };

       console.log("注文データを作成:", orderData);
       
       // APIを呼び出して注文を作成
       const createdOrder = await createOrder(parseInt(supporterId), parseInt(shelterId), orderData);
       
       console.log("注文作成成功:", createdOrder);
      
             // 確認ダイアログを表示
       const confirmed = confirm(`支援手続きに進みます。注文番号: ${createdOrder.orderNumber || 'N/A'}\n\n確認しますか？`);
       
       if (confirmed) {
         // カートをクリア
         await clearCartApi(parseInt(supporterId), parseInt(shelterId));
         
         // 支払いページにリダイレクト
         window.location.href = `/supporter/${supporterId}/${shelterId}/payment?orderId=${createdOrder.id}`;
       }
     } catch (error) {
       console.error('注文作成に失敗:', error);
       alert('注文作成に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  // 合計
  const totals = useMemo(() => {
    const totalUnits = cart.items.reduce((s, it) => s + it.quantity, 0);
    const subtotal   = cart.items.reduce((s, it) => s + (it.unitPriceYen ?? 0) * it.quantity, 0);
    return { totalUnits, subtotal };
  }, [cart]);

  return (
    <SupporterLayout>
      <div className="min-h-screen bg-white pb-28">
        <div className="mx-auto max-w-screen-xl px-4 pt-8">
          <div className="mb-6">
            <BackButton fallbackHref={`/supporter/${supporterId}/home`} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">買い物かご</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "読み込み中…" : <>最終更新：<b>{new Date(cart.updatedAtISO).toLocaleString()}</b></>}
          </p>

          {/* アクション */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={clearAll} className="rounded-xl px-4 py-2 border hover:bg-gray-50">
              カートを空にする
            </button>
          </div>

          {/* 本体 */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左：明細 */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border overflow-hidden bg-white">
                <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
                  商品一覧（{cart.items.length}件）
                </div>

                {cart.items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-4">🛒</div>
                    <p>カートに商品がありません</p>
                    <p className="text-sm mt-2">
                      <a href={`/supporter/${supporterId}/${shelterId}/supplies`} className="text-blue-600 hover:underline">
                        物資一覧に戻る
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {cart.items.map((item, index) => (
                      <div key={`${item.productId}-${index}`} className="p-4 flex gap-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">画像</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                          <p className="text-sm text-gray-500">{item.unit}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="ml-4 text-red-600 hover:text-red-800 text-sm"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-semibold">{fmtJPY(item.unitPriceYen)}</div>
                          <div className="text-sm text-gray-500">× {item.quantity}</div>
                          <div className="font-bold text-lg">{fmtJPY((item.unitPriceYen ?? 0) * item.quantity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 右：サマリ */}
            <aside className="lg:col-span-1">
              <div className="rounded-2xl border p-4 space-y-4">
                <div>
                  <div className="text-sm text-gray-500">合計数量</div>
                  <div className="text-xl font-bold">{totals.totalUnits.toLocaleString()} 点</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">小計</div>
                  <div className="text-2xl font-extrabold">{fmtJPY(totals.subtotal)}</div>
                </div>

                <button
                  disabled={submitting || cart.items.length === 0}
                  onClick={onCheckout}
                  className="w-full rounded-xl px-5 py-3 text-white disabled:opacity-50"
                  style={{ backgroundColor: RAKUTEN_RED }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
                >
                  {submitting ? "処理中…" : "注文手続きへ"}
                </button>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </SupporterLayout>
  );
}
