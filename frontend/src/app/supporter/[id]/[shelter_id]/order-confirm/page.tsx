"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCart } from '@/lib/api/cart';
import { request } from '@/lib/api/base';
import { getUserPaymentInfo } from '@/lib/api/userPayment';
import BackButton from "@/components/BackButton";

// 型定義
interface PaymentData {
  method: string;
  savedCardId?: string;
  oneTimeCard?: {
    id: string;
    brand: string;
    last4: string;
    holder: string;
    exp: string;
  };
}

interface CartItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

interface OrderData {
  payment: PaymentData;
  cartItems: CartItem[];
  totalAmount: number;
}

interface OrderResponse {
  id: number;
  orderNumber: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams<{ id: string; shelter_id: string }>();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const supporterId = params.id as string;
        const shelterId = params.shelter_id as string;

        if (!supporterId || !shelterId) {
          console.error("URLパラメータが不正です");
          setLoading(false);
          return;
        }

        // ユーザー固有の支払い情報を取得
        let payment: PaymentData;
        try {
          const userPaymentInfo = await getUserPaymentInfo(parseInt(supporterId));
          
                     if (userPaymentInfo.cardNumber && userPaymentInfo.cardExpiry) {
             // ユーザーに保存された支払い情報がある場合
             payment = {
               method: "card",
               oneTimeCard: {
                 id: `user_${supporterId}`,
                 brand: "Unknown", // ブランドは後で判定
                 last4: userPaymentInfo.cardNumber.replace(/\D/g, "").slice(-4),
                 holder: userPaymentInfo.cardHolder || userPaymentInfo.fullName || "",
                 exp: userPaymentInfo.cardExpiry
               }
             };
          } else {
            // ユーザーに保存された支払い情報がない場合、デフォルトの支払い方法を使用
            payment = {
              method: "card",
              oneTimeCard: {
                id: `temp_${Date.now()}`,
                brand: "Unknown",
                last4: "0000",
                holder: "TEMP USER",
                exp: "12/25"
              }
            };
          }
        } catch (error) {
          console.log("ユーザーの支払い情報の取得に失敗しました:", error);
          // デフォルトの支払い方法を使用
          payment = {
            method: "card",
            oneTimeCard: {
              id: `temp_${Date.now()}`,
              brand: "Unknown",
              last4: "0000",
              holder: "TEMP USER",
              exp: "12/25"
            }
          };
        }

        // データベースからカートデータを取得
        try {
          const cartData = await getCart(parseInt(supporterId), parseInt(shelterId));
          console.log("データベースから取得したカートデータ:", cartData);
          
          const cartItems: CartItem[] = cartData.items?.map((item: any) => ({
            id: item.id || 0,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit || 0,
            totalPrice: item.totalPrice || (item.pricePerUnit || 0) * item.quantity
          })) || [];
          
          const totalAmount = cartItems.reduce((sum: number, item: CartItem) => 
            sum + (item.totalPrice || 0), 0);
          
          console.log("処理されたカートアイテム:", cartItems);
          console.log("合計金額:", totalAmount);
          
          setOrderData({
            payment,
            cartItems,
            totalAmount
          });
        } catch (error) {
          console.error("カートデータの取得に失敗しました:", error);
          // カートデータの取得に失敗した場合、エラーメッセージを表示
          alert("カートデータの取得に失敗しました。もう一度お試しください。");
          router.push(`/supporter/${supporterId}/${shelterId}/shopping_cart`);
          return;
        }
      } catch (error) {
        console.error("データの解析に失敗しました:", error);
        alert("データの解析に失敗しました。もう一度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [params.id, params.shelter_id, router]);

  // 注文確定処理
  const confirmOrder = async () => {
    if (!orderData) return;
    
    try {
      console.log("注文データ:", orderData);
      
      const supporterId = params.id as string;
      const shelterId = params.shelter_id as string;
      
      // 1. 创建订单
      const orderResponse = await request(`/api/orders/${supporterId}/${shelterId}`, {
        method: 'POST',
        body: JSON.stringify({
          userId: parseInt(supporterId),
          shelterId: parseInt(shelterId),
          status: 'PENDING',
          paymentStatus: 'PENDING',
          totalAmount: orderData.totalAmount,
          shippingAddress: 'テスト住所', // TODO: ユーザー情報から取得
          contactPhone: '090-1234-5678', // TODO: ユーザー情報から取得
          contactEmail: 'test@example.com', // TODO: ユーザー情報から取得
          items: orderData.cartItems.map((item: CartItem) => ({
            productId: item.productId,
            productName: item.productName,
            unit: item.unit,
            category: 'general', // TODO: 商品情報から取得
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            totalPrice: item.totalPrice,
            notes: null
          }))
        })
      }) as OrderResponse;
      
      console.log("订单创建成功:", orderResponse);
      
      // 2. 创建支付记录
      const paymentResponse = await request('/api/payments', {
        method: 'POST',
        body: JSON.stringify({
          orderId: orderResponse.id,
          paymentMethod: orderData.payment.method,
          paymentStatus: 'COMPLETED',
          amount: orderData.totalAmount,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          notes: `注文ID: ${orderResponse.id} の支払い`
        })
      });
      
      console.log("支付记录创建成功:", paymentResponse);
      
      // 3. 更新订单状态为已完成
      const updateOrderResponse = await request(`/api/orders/${orderResponse.id}/status?status=COMPLETED`, {
        method: 'PUT'
      });
      
      console.log("订单状态更新成功:", updateOrderResponse);
      
      // 完了ページに遷移（URLパラメータから正しいIDを取得）
      const pathSegments = window.location.pathname.split('/');
      const pathSupporterId = pathSegments[2];
      const pathShelterId = pathSegments[3];
      
      // 完了ページに必要なデータを保存
      const completeData = {
        ...orderData.payment,
        orderId: orderResponse.id,
        orderNumber: orderResponse.orderNumber,
        totalAmount: orderData.totalAmount,
        supporterId: pathSupporterId,
        shelterId: pathShelterId
      };
      localStorage.setItem("paymentData", JSON.stringify(completeData));
      
      // データベースのカートをクリア（支払い完了後）
      try {
        await request(`/api/cart/${supporterId}/${shelterId}`, {
          method: 'DELETE'
        });
        console.log("カートをクリアしました");
      } catch (error) {
        console.warn('カートのクリアに失敗しましたが、注文は完了しています');
      }
      
      router.push(`/supporter/${pathSupporterId}/${pathShelterId}/order-complete`);
      
      // localStorageをクリア（paymentDataは完了ページで使用するため残す）
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("注文の確定に失敗しました:", error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(`注文の確定に失敗しました: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">注文データが見つかりません</h1>
          <p className="text-gray-600 mb-6">支払いページから再度お試しください。</p>
          <Link 
            href={`/supporter/${params?.id}/${params?.shelter_id}/payment`} 
            className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50"
          >
            支払いページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <BackButton fallbackHref={`/supporter/${params?.id}/home`} />
      </div>
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/cart" className="hover:underline">カート</Link>
        <span className="mx-2">›</span>
        <Link href="/supporter/1/1/payment" className="hover:underline">支払い方法</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">注文確認</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">注文確認</h1>
        <p className="text-gray-600 mt-1">注文内容と支払い情報を確認してください</p>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-8">
        <Step n={1} label="カート" active={false} />
        <Step n={2} label="支払い" active={false} />
        <Step n={3} label="確認" active={true} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 注文内容 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">注文内容</h2>
          
          <div className="space-y-4">
            {orderData.cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.unit} × ¥{item.pricePerUnit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">¥{item.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>合計金額</span>
              <span>¥{orderData.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 支払い情報 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">支払い情報</h2>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">支払い方法:</span>
                <p className="font-medium">クレジットカード</p>
              </div>
              
              {orderData.payment.oneTimeCard && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">カード番号:</span>
                    <p className="font-medium">•••• •••• •••• {orderData.payment.oneTimeCard.last4}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">名義人:</span>
                    <p className="font-medium">{orderData.payment.oneTimeCard.holder}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">有効期限:</span>
                    <p className="font-medium">{orderData.payment.oneTimeCard.exp}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 配送情報 */}
          <div className="space-y-4">
            <h3 className="font-semibold">配送情報</h3>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">配送先住所</p>
              <p className="font-medium">テスト住所</p>
              
              <p className="text-sm text-gray-600 mb-1 mt-3">連絡先電話番号</p>
              <p className="font-medium">090-1234-5678</p>
              
              <p className="text-sm text-gray-600 mb-1 mt-3">連絡先メール</p>
              <p className="font-medium">test@example.com</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 flex flex-col md:flex-row gap-3 justify-between items-center">
        <Link 
          href={`/supporter/${params?.id}/${params?.shelter_id}/payment`} 
          className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50"
        >
          戻る
        </Link>
        <button
          onClick={confirmOrder}
          className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50"
        >
          注文を確定する
        </button>
      </footer>
    </div>
  );
}

// UI Components
function Step({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <div className={`text-center ${active ? "text-blue-600" : "text-gray-400"}`}>
      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
        active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
      }`}>
        {n}
      </div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
