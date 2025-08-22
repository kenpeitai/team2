"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser} from '@/lib/api';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setMessage(null);
    
    try {
      const form = new FormData(e.currentTarget);
      const email = form.get('email');
      const password = form.get('password');
      const body = { email: typeof email === 'string' ? email : '', password: typeof password === 'string' ? password : '' };
      
      const res = await loginUser(body);
      
      if (res.token) {
        localStorage.setItem('token', res.token);
        setMessage('ログインしました。リダイレクト中...');
        setIsError(false);
        // ログイン成功時に支援者のホーム画面に遷移
        setTimeout(() => {
          router.push(`/supporter/${res.user?.id}/home`);
        }, 1000);
      } else {
        setMessage(res.message ?? 'ログインに失敗しました');
        setIsError(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // 处理网络错误或服务器错误
      const status = error.cause?.status || error.status;
      
      if (status === 401) {
        setMessage('メールアドレスまたはパスワードが正しくありません');
      } else if (status === 400) {
        setMessage('入力内容に誤りがあります。もう一度お試しください。');
      } else if (status >= 500) {
        setMessage('サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。');
      } else if (error.message && error.message.includes('メールアドレスまたはパスワードが正しくありません')) {
        setMessage('メールアドレスまたはパスワードが正しくありません');
      } else {
        setMessage('ログインに失敗しました。ネットワーク接続を確認してください。');
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md -translate-y-4 md:-translate-y-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ログイン
            </h1>
            <p className="text-gray-600">
              アカウントにログインしてください
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* メールアドレス入力 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* パスワード入力 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="パスワードを入力"
                required
              />
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ログイン中...
                </div>
              ) : (
                'ログイン'
              )}
            </button>

            {message && (
              <div className={`text-center text-sm p-3 rounded-lg ${
                isError 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}
          </form>


          <div className="mt-6 text-center">
            <Link 
              href="/supporter/register" 
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              アカウントをお持ちでない方はこちら
            </Link>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 楽天グループ. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
