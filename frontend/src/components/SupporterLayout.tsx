import Image from "next/image";
import Link from "next/link";

export default function SupporterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
              {/* かごページのパスは運用に合わせて。/cart か /supporter/cart など */}
              <Link
                href="/supporter/shopping-cart"
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                かごを見る
              </Link>
             
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
