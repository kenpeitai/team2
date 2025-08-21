"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderConpletePage() {
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // 从localStorage获取订单信息（如果还有的话）
    const paymentData = localStorage.getItem("checkout.payment");
    if (paymentData) {
      try {
        const payment = JSON.parse(paymentData);
        setOrderInfo(payment);
      } catch (error) {
        console.error("支払いデータの解析に失敗しました:", error);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/cart" className="hover:underline">カート</Link>
        <span className="mx-2">›</span>
        <Link href="/supporter/1/1/payment" className="hover:underline">支払い方法</Link>
        <span className="mx-2">›</span>
        <Link href="/supporter/1/1/order_confirm" className="hover:underline">注文確認</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">完了</span>
      </nav>

      <div className="text-center py-12">
        {/* 成功图标 */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* 成功消息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          注文が完了しました！
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          避難所への支援物資の注文が正常に処理されました。<br />
          ご協力いただき、ありがとうございます。
        </p>

        {/* 注文詳細 */}
        {orderInfo && (
          <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">注文詳細</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>支払い方法:</span>
                <span className="font-medium">クレジットカード</span>
              </div>
              {orderInfo.oneTimeCard && (
                <>
                  <div className="flex justify-between">
                    <span>カード番号:</span>
                    <span className="font-medium">•••• •••• •••• {orderInfo.oneTimeCard.last4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>名義人:</span>
                    <span className="font-medium">{orderInfo.oneTimeCard.holder}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 次のステップ */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">次のステップ</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• 注文確認メールが送信されます</p>
            <p>• 支援物資は避難所に直接配送されます</p>
            <p>• 配送状況は避難所から確認できます</p>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/supporter/1/1/payment"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            追加で支援する
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ホームに戻る
          </Link>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 text-xs text-gray-500 max-w-2xl mx-auto">
          <p>
            ご質問やご不明な点がございましたら、<br />
            避難所またはサポートチームまでお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}
