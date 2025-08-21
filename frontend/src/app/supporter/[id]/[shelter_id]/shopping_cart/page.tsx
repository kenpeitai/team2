"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from 'next/navigation';
import { getCart, updateCartItemQuantity, removeItemFromCart, clearCart as clearCartApi } from '@/lib/api/cart';
import SupporterLayout from '@/components/SupporterLayout';

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
const LS_KEY = "supporter:cart:v1";
const RAKUTEN_RED = "#BF0000";
const RAKUTEN_RED_HOVER = "#990000";
const fmtJPY = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("ja-JP", { style: "currency", currency: "JPY" }) : "—";

/* ====== ストレージ ====== */
function loadCart(): SupporterCart {
  if (typeof window === "undefined") return { updatedAtISO: new Date().toISOString(), items: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { updatedAtISO: new Date().toISOString(), items: [] };
    const parsed = JSON.parse(raw) as SupporterCart;
    return parsed && Array.isArray(parsed.items) ? parsed : { updatedAtISO: new Date().toISOString(), items: [] };
  } catch {
    return { updatedAtISO: new Date().toISOString(), items: [] };
  }
}
function saveCart(next: SupporterCart) {
  const stamped = { ...next, updatedAtISO: new Date().toISOString() };
  localStorage.setItem(LS_KEY, JSON.stringify(stamped));
  return stamped;
}

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
      } else {
        await updateCartItemQuantity(parseInt(supporterId), parseInt(shelterId), id, newQty);
      }
      
      // 重新加载购物车数据
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
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('数量の更新に失敗しました。');
    }
  };
  
  const removeItem = async (id: string) => {
    try {
      await removeItemFromCart(parseInt(supporterId), parseInt(shelterId), id);
      
      // 重新加载购物车数据
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
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('商品の削除に失敗しました。');
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

  // チェックアウト（モック：バックエンドは別チーム）
  const onCheckout = async () => {
    if (!cart.items.length) return alert("カートが空です。");
    setSubmitting(true);
    try {
      const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      console.log("checkout payload (mock)", cart);
      alert(`支援手続きに進みます（モック）。注文番号: ${orderId}`);
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
        <h1 className="text-3xl font-extrabold tracking-tight">買い物かご</h1>
        <p className="text-sm text-gray-600 mt-1">
          {loading ? "読み込み中…" : <>最終更新：<b>{new Date(cart.updatedAtISO).toLocaleString()}</b></>}
        </p>

        {/* アクション（デモ追加ボタンは削除） */}
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
                <div className="p-8 text-center text-gray-600">カートに商品がありません。</div>
              ) : (
                <ul className="divide-y">
                  {cart.items.map((it) => (
                    <li key={it.productId} className="p-4 flex gap-4 items-center">
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                        <CartImage
                          productId={it.productId}
                          imageUrl={it.imageUrl}
                          alt={it.productName}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{it.productName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          単価：{fmtJPY(it.unitPriceYen)} / {it.unit}
                        </div>

                        <div className="mt-2 inline-flex items-center gap-2">
                          <QtyButton onClick={() => updateQty(it.productId, it.quantity - 1)}>-</QtyButton>
                          <input
                            type="number"
                            min={0}
                            value={it.quantity}
                            onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                            className="w-20 rounded-xl border px-3 py-2 text-right"
                          />
                          <QtyButton onClick={() => updateQty(it.productId, it.quantity + 1)}>+</QtyButton>
                          <span className="text-sm text-gray-500">{it.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">小計</div>
                        <div className="text-lg font-bold">
                          {fmtJPY(typeof it.unitPriceYen === "number" ? it.unitPriceYen * it.quantity : undefined)}
                        </div>
                        <button onClick={() => removeItem(it.productId)} className="mt-2 text-xs text-red-600 hover:underline">
                          削除
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
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
    </SupporterLayout>
  );
}

/* ====== 画像表示（申請画面と同じ方式：候補URLを順にフォールバック） ====== */
function CartImage({
  productId,
  imageUrl,
  alt,
}: {
  productId: string;
  imageUrl?: string;
  alt: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);

  useEffect(() => {
    const given = imageUrl ? [imageUrl] : [];
    const fallbacks = ["/products", "/images"].flatMap((base) =>
      [".jpg", ".png", ".webp"].map((ext) => `${base}/${productId}${ext}`)
    );
    const list = [...given, ...fallbacks];
    setCandidates(list);
    setSrc(list[0] ?? null);
  }, [productId, imageUrl]);

  const onError = () => {
    setCandidates((prev) => {
      const next = prev.slice(1);
      setSrc(next[0] ?? null);
      return next;
    });
  };

  if (!src) {
    return (
      <div className="h-full w-full grid place-items-center bg-gradient-to-br from-gray-100 to-gray-200 text-xs text-gray-500">
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
      onError={onError}
    />
  );
}

/* ====== 小物 ====== */
function QtyButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 w-10 rounded-xl border flex items-center justify-center text-lg hover:bg-gray-50"
      aria-label="change quantity"
      title="数量を変更"
    >
      {children}
    </button>
  );
}
