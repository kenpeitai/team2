"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser} from '@/lib/api';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
  
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const email = form.get('email');
      const password = form.get('password');
      const body = { email: typeof email === 'string' ? email : '', password: typeof password === 'string' ? password : '' };
      const res = await loginUser(body);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setMessage('ログインしました。リダイレクト中...');
        // ログイン成功時に支援者のホーム画面に遷移
        setTimeout(() => {
          router.push(`/supporter/${res.user?.id}/home`);
        }, 1000);
      } else {
        setMessage(res.message ?? 'ログインに失敗しました');
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
              className="w-full btn btn-primary"
            >
              ログイン
            </button>

            {message && <p className="text-center text-sm text-gray-700">{message}</p>}
          </form>


          <div className="mt-6 text-center">
            <Link 
              href="/supporter/register_supporter" 
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
