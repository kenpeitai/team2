"use client";
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
=======
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
>>>>>>> main

export default function SupporterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
<<<<<<< HEAD
  const pathname = usePathname();
  
  // 判断是否应该显示"かごを見る"链接
  // 只有在避难所相关页面（supplies, payment, order_confirm）才显示，购物车页面本身不显示
  const shouldShowCartLink = pathname.includes('/supplies') || 
                           pathname.includes('/payment') || 
                           pathname.includes('/order_confirm');
  
  // 生成购物车链接
  const getCartLink = () => {
    const pathParts = pathname.split('/');
    if (pathParts.length >= 4) {
      // 从路径中提取supporter ID和shelter ID
      const supporterId = pathParts[2];
      const shelterId = pathParts[3];
      return `/supporter/${supporterId}/${shelterId}/shopping_cart`;
    }
    return '/supporter/1/1/shopping_cart'; // 默认链接
=======
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/supporter/login");
    }
>>>>>>> main
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 上部ナビゲーション（支援者用） */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴとタイトル */}
            <div className="flex items-center space-x-4">
              {/* ← 支援者側ホームへ */}
              <Link href="/supporter/home" aria-label="Supporter Home" className="inline-flex items-center">
                <Image
                  src="/rakuten-logo.png"
                  alt="楽天ロゴ"
                  width={100}
                  height={32}
                  priority
                />
              </Link>
              <h1 className="text-lg font-bold text-gray-900">
                支援者向けポータル
              </h1>
            </div>

            {/* 右ナビ（必要に応じて調整） */}
            <div className="flex items-center space-x-4">
<<<<<<< HEAD
<<<<<<< HEAD
              {shouldShowCartLink && (
                <Link
                  href={getCartLink()}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  かごを見る
                </Link>
              )}
=======
              {/* かごページのパスは運用に合わせて。/cart か /supporter/cart など */}
=======
              {mounted && isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  type="button"
                >
                  ログアウト
                </button>
              ) : (
                <Link 
                  href="/supporter/login" 
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ログイン
                </Link>
              )}
              <Link 
                href="/supporter/register" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                新規登録
              </Link>
>>>>>>> main
              <Link
                href="/supporter/shopping-cart"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                かごを見る
              </Link>
<<<<<<< HEAD
             
>>>>>>> origin/main
=======
>>>>>>> main
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
