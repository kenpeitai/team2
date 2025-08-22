"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function SupporterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  
  // 判断是否应该显示"かごを見る"链接
  // 只有在避难所相关页面（supplies, payment, order_confirm）才显示，购物车页面本身不显示
  const shouldShowCartLink = pathname.includes('/supplies') || 
                           pathname.includes('/payment') || 
                           pathname.includes('/order_confirm');
  
  // 生成购物车链接
  const getCartLink = (): string => {
    const pathParts = pathname.split('/');
    if (pathParts.length >= 4) {
      // 从路径中提取supporter ID和shelter ID
      const supporterId = pathParts[2];
      const shelterId = pathParts[3];
      return `/supporter/${supporterId}/${shelterId}/shopping-cart`;
    }
    return '/supporter/1/1/shopping-cart'; // 默认链接
  };

  // 生成支援者主页链接
  const getHomeLink = (): string => {
    const pathParts = pathname.split('/');
    if (pathParts.length >= 3) {
      // 从路径中提取supporter ID
      const supporterId = pathParts[2];
      return `/supporter/${supporterId}/home`;
    }
    return '/supporter/1/home'; // 默认链接
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 调用后端logout API
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      // 无论API调用成功与否，都清除本地token并跳转
      localStorage.removeItem("token");
      // 强制跳转到登录页面
      window.location.href = "/supporter/login";
    }
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
              <Link href={getHomeLink()} aria-label="Supporter Home" className="inline-flex items-center">
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
               <button
                 onClick={handleLogout}
                 className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 type="button"
               >
                 ログアウト
               </button>
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
