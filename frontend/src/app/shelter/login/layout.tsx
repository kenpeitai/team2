import Image from "next/image";
import Link from "next/link";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
