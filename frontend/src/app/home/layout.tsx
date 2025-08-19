import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "避難所情報共有システム",
  description: "避難所の情報を共有するシステム",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          {/* 上部ナビゲーション */}
          <header className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* ロゴとタイトル */}
                <div className="flex items-center space-x-4">
                  <Image
                    src="/rakuten-logo.png"
                    alt="楽天ロゴ"
                    width={100}
                    height={32}
                    priority
                  />
                  <h1 className="text-lg font-bold text-gray-900">
                    避難所情報共有システム
                  </h1>
                </div>

                {/* ナビゲーションメニュー */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    ホーム
                  </Link>
                  <Link 
                    href="/shelter" 
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    避難所一覧
                  </Link>
                  <Link 
                    href="/shelter_status" 
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    避難所状況
                  </Link>
                </nav>

                {/* 認証リンク */}
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    ログイン
                  </Link>
                  <Link 
                    href="/logout" 
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    ログアウト
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
      </body>
    </html>
  );
}
