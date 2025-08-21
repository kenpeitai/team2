"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useRouter, useParams } from "next/navigation";

// ===== Types =====
export type PaymentMethod = "card"; // 避難所向け: カード限定

type SavedCard = {
  id: string;
  brand: "Visa" | "Mastercard" | "JCB" | "Amex" | "Unknown";
  last4: string;
  holder: string;
  exp: string; // MM/YY
};

// ===== Helpers =====
const brands = ["Visa", "Mastercard", "JCB", "Amex"] as const;

function guessBrand(num: string): SavedCard["brand"] {
  const n = num.replace(/\s|-/g, "");
  if (/^4\d{12,18}$/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])\d{14}$/.test(n)) return "Mastercard";
  if (/^3[47]\d{13}$/.test(n)) return "Amex";
  if (/^(352[89]|35[3-8]\d)\d{12}$/.test(n)) return "JCB";
  return "Unknown";
}

function maskCardNumber(n: string) {
  const digits = n.replace(/\D/g, "");
  return digits
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim()
    .slice(0, 19);
}

function validExpiry(mmYY: string) {
  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmYY)) return false;
  const [mm, yy] = mmYY.split("/").map(Number);
  const now = new Date();
  const y = now.getFullYear() % 100;
  const m = now.getMonth() + 1;
  return yy > y || (yy === y && mm >= m);
}

function cvcLength(brand: SavedCard["brand"]) {
  return brand === "Amex" ? 4 : 3;
}

// ===== Page =====
export default function PaymentPage() {
  const router = useRouter();
  const params = useParams<{ id: string; shelter_id: string }>();

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [saveCard, setSaveCard] = useState(true);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

  // New card fields
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState(""); // MM/YY
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    // Load saved cards
    const raw = localStorage.getItem("savedCards");
    if (raw) {
      try {
        const list = JSON.parse(raw) as SavedCard[];
        setSavedCards(list);
        if (list.length) setSelectedSavedId(list[0].id);
      } catch {}
    }
    // Preload previous selection if any
    const prev = localStorage.getItem("checkout.payment");
    if (prev) {
      try {
        const p = JSON.parse(prev);
        if (p.method) setMethod(p.method);
        if (p.method === "card" && p.savedCardId) setSelectedSavedId(p.savedCardId);
      } catch {}
    }
  }, []);

  const brand = useMemo(() => guessBrand(number), [number]);

  // ===== onContinue Function =====
  const onContinue = () => {
    if (method === "card") {
      // 获取URL参数中的ID
      const pathSegments = window.location.pathname.split('/');
      const supporterId = pathSegments[2]; // /supporter/[id]/[shelter_id]/payment
      const shelterId = pathSegments[3];
      
      // 生成订单号
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // 从localStorage获取购物车信息来计算总金额
      const cartData = localStorage.getItem("cart");
      let totalAmount = 0;
      if (cartData) {
        try {
          const cart = JSON.parse(cartData) as Array<{ price: number; quantity: number }>;
          totalAmount = cart.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
        } catch (error) {
          console.error("购物车数据解析失败:", error);
        }
      }
      
      const payload: Record<string, unknown> = { 
        method,
        orderId,
        totalAmount,
        supporterId,
        shelterId,
        timestamp: new Date().toISOString()
      };
      
      if (selectedSavedId) {
        // 使用保存的卡
        const saved = savedCards.find((c: SavedCard) => c.id === selectedSavedId);
        if (saved) {
          payload.savedCardId = selectedSavedId;
          payload.oneTimeCard = saved;
        }
      } else {
        // 使用新输入的卡
        if (saveCard) {
          const newCard: SavedCard = {
            id: `card_${Date.now()}`,
            brand,
            last4: number.replace(/\D/g, "").slice(-4),
            holder,
            exp: expiry
          };
          
          // 保存到localStorage
          const existing = JSON.parse(localStorage.getItem("savedCards") || "[]");
          existing.push(newCard);
          localStorage.setItem("savedCards", JSON.stringify(existing));
          
          payload.oneTimeCard = newCard;
        } else {
          payload.oneTimeCard = {
            id: `temp_${Date.now()}`,
            brand,
            last4: number.replace(/\D/g, "").slice(-4),
            holder,
            exp: expiry
          };
        }
      }
      
      // 保存支付信息到paymentData（与order_conplete页面保持一致）
      localStorage.setItem("paymentData", JSON.stringify(payload));
      
      // 跳转到订单确认页面
      router.push(`/supporter/${supporterId}/${shelterId}/order-confirm`);
    }
  };

  // ===== Validation =====
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (method === "card") {
      if (!selectedSavedId) {
        if (!holder || holder.trim().length < 2) e.holder = "名義人を入力してください";
        const digits = number.replace(/\D/g, "");
        if (digits.length < 13 || digits.length > 19) e.number = "カード番号が正しくありません";
        if (!validExpiry(expiry)) e.expiry = "有効期限(MM/YY)が正しくありません";
        const need = cvcLength(brand);
        if (!new RegExp(`^\\d{${need}}$`).test(cvc)) e.cvc = `セキュリティコード(${need}桁)`;
      }
    }
    return e;
  }, [method, selectedSavedId, holder, number, expiry, cvc, brand]);



  // Simple step indicator
  const Step = ({ n, label, active }: { n: number; label: string; active: boolean }) => (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
        active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
      }`}>{n}</div>
      <span className={`text-sm ${active ? "text-blue-700" : "text-gray-500"}`}>{label}</span>
    </div>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <BackButton fallbackHref={`/supporter/${params?.id}/home`} />
      </div>
      <nav className="text-sm mb-4 text-gray-500">
        <Link href="/cart" className="hover:underline">カート</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">支払い方法</span>
        <span className="mx-2">›</span>
        <span className="text-gray-400">確認</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">支払い方法の設定</h1>
        <p className="text-gray-600 mt-1">避難所へのお届けのため、<span className="font-semibold">支払い方法はクレジット/デビットカードのみ</span>です。</p>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-8">
        <Step n={1} label="カート" active={false} />
        <Step n={2} label="支払い" active={true} />
        <Step n={3} label="確認" active={false} />
      </section>

      {/* 支払い方法（固定） */}
      <section className="space-y-3">
        <h2 className="font-semibold">支払い方法</h2>
        <div className="rounded-xl border p-4 bg-blue-50/60 border-blue-200">
          <div className="font-medium">クレジット/デビットカード</div>
          <div className="text-sm text-gray-700 mt-0.5">Visa / Mastercard / JCB / Amex に対応</div>
        </div>
      </section>

      {/* Details */}
      <section className="mt-6">
        {method === "card" && (
          <div className="space-y-4">
            {savedCards.length > 0 && (
              <div className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">保存済みのカード</h3>
                  <button
                    onClick={() => setSelectedSavedId(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    新しいカードを使う
                  </button>
                </div>
                <div className="space-y-2">
                  {savedCards.map((c) => (
                    <label key={c.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="saved"
                        className="accent-blue-600"
                        checked={selectedSavedId === c.id}
                        onChange={() => setSelectedSavedId(c.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{c.brand} •••• {c.last4}</div>
                        <div className="text-sm text-gray-500">{c.holder} / 期限 {c.exp}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!selectedSavedId && (
              <div className="border rounded-xl p-4">
                <h3 className="font-medium mb-3">カード情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">名義人（ローマ字推奨）</label>
                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="TARO YAMADA"
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${errors.holder ? "border-red-400 ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    />
                    {errors.holder && <p className="text-sm text-red-600 mt-1">{errors.holder}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">カード番号</label>
                    <input
                      inputMode="numeric"
                      value={number}
                      onChange={(e) => setNumber(maskCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${errors.number ? "border-red-400 ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">推定ブランド: {brand}</div>
                    {errors.number && <p className="text-sm text-red-600 mt-1">{errors.number}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">有効期限 (MM/YY)</label>
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        setExpiry(v.slice(0, 5));
                      }}
                      placeholder="12/29"
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${errors.expiry ? "border-red-400 ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    />
                    {errors.expiry && <p className="text-sm text-red-600 mt-1">{errors.expiry}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">セキュリティコード</label>
                    <input
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, cvcLength(brand)))}
                      placeholder={cvcLength(brand) === 4 ? "1234" : "123"}
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${errors.cvc ? "border-red-400 ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    />
                    {errors.cvc && <p className="text-sm text-red-600 mt-1">{errors.cvc}</p>}
                  </div>
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm select-none">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  このカードを保存する
                </label>
              </div>
            )}
          </div>
        )}

        
        
        
        
      </section>

      <footer className="mt-8 flex flex-col md:flex-row gap-3 justify-between items-center">
        <Link href="/cart" className="px-4 py-2 rounded-xl border hover:bg-gray-50">戻る</Link>
        <button
          onClick={onContinue}
          className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50"
          disabled={method === "card" && !selectedSavedId && Object.keys(errors).length > 0}
        >
          確認へ進む
        </button>
      </footer>

      <p className="mt-6 text-xs text-gray-500">
        ※ テスト用にローカルストレージ(<code>savedCards</code>, <code>checkout.payment</code>)へ保存します。本番では実決済サービスに置き換えてください。
      </p>
    </main>
  );
}

// ===== UI Bits =====
function MethodCard({
  active,
  onClick,
  title,
  subtitle,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition shadow-sm hover:shadow ${
        active ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{icon ?? "💰"}</div>
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          {subtitle && <div className="text-sm text-gray-600 mt-0.5">{subtitle}</div>}
        </div>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
          active ? "border-blue-600" : "border-gray-300"
        }`}>
          <div className={`w-3 h-3 rounded-full ${active ? "bg-blue-600" : "bg-transparent"}`} />
        </div>
      </div>
    </button>
  );
}

function HintBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
