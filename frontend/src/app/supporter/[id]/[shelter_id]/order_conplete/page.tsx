"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderConpletePage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [supporterId, setSupporterId] = useState<string | null>(null);

  useEffect(() => {
    // ローカルストレージから支払いデータを取得
    const paymentData = localStorage.getItem("paymentData");
    if (paymentData) {
      try {
        const payment = JSON.parse(paymentData);
        setOrderInfo(payment);
        setOrderId(payment.orderId || "生成中...");
        setTotalAmount(payment.totalAmount || 0);
        setSupporterId(payment.supporterId || "1");
      } catch (error) {
        console.error("支払いデータの解析に失敗しました:", error);
      }
    }
  }, []);

  const handleContinue = () => {
    // 使用正确的URL结构跳转回支持者主页
    if (supporterId) {
      router.push(`/supporter/${supporterId}/home`);
    } else {
      // 如果supporterId不存在，从URL路径获取
      const pathSegments = window.location.pathname.split('/');
      const id = pathSegments[2];
      router.push(`/supporter/${id}/home`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              注文完了
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ご注文が完了しました。ありがとうございます。
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                注文詳細
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>注文番号:</span>
                  <span className="font-medium">{orderId || "生成中..."}</span>
                </div>
                <div className="flex justify-between">
                  <span>注文日時:</span>
                  <span>{new Date().toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>合計金額:</span>
                  <span className="font-medium">
                    {totalAmount ? `¥${totalAmount.toLocaleString()}` : "¥0"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
