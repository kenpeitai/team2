import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "災害支援システム",
  description: "災害時の支援を行うシステム",
};

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-gray-50">
          {/* サイドバー */}
          <div className="w-64 bg-white shadow-lg">
            {/* ヘッダー部分 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <Image
                  src="/rakuten-logo.png"
                  alt="楽天ロゴ"
                  width={100}
                  height={32}
                  priority
                />
              </div>
              <h1 className="text-lg font-bold text-gray-900">
                災害支援システム
              </h1>
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <span>ホーム</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/shelter" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <span>避難所一覧</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/shelter_status" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <span>避難所状況</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* 認証セクション */}
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
              <div className="space-y-2">
                <Link 
                  href="/login" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <span>ログイン</span>
                </Link>
                <Link 
                  href="/logout" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <span>ログアウト</span>
                </Link>
              </div>
            </div>
          </div>

          {/* メインコンテンツエリア */}
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
