"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      router.push("/shelter/login");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 上部ナビゲーション */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴとタイトル */}
            <div className="flex items-center space-x-4">
              <Link href="/shelter/home" aria-label="Home" className="inline-flex items-center">
                <Image
                  src="/rakuten-logo.png"
                  alt="楽天ロゴ"
                  width={100}
                  height={32}
                  priority
                />
              </Link>
              <h1 className="text-lg font-bold text-gray-900">
                避難所情報共有システム
              </h1>
            </div>

          

            {/* 認証リンク */}
            <div className="flex items-center space-x-4">
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
                  href="/shelter/login"
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ログイン
                </Link>
              )}
              <Link 
                href="/shelter/register" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}


