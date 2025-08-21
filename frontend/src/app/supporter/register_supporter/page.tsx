"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const emailConfirmation = formData.get('emailConfirmation') as string;
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;
    const fullName = formData.get('fullName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    // バリデーション
    const newErrors: string[] = [];
    
    if (email !== emailConfirmation) {
      newErrors.push('メールアドレスが一致しません');
    }
    
    if (password !== passwordConfirmation) {
      newErrors.push('パスワードが一致しません');
    }
    
    if (password.length < 8) {
      newErrors.push('パスワードは8文字以上で入力してください');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber,
          role: 'USER'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('登録が完了しました！');
        // 登録成功後、ログインページに遷移
        setTimeout(() => {
          router.push('/supporter/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors([errorData.message || '登録に失敗しました']);
      }
    } catch (error) {
      setErrors(['ネットワークエラーが発生しました']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-2">支援者情報登録</h1>
          <p className="text-sm text-foreground/70 mb-6">
            支援者として登録するために、以下の情報を入力してください。
          </p>

          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* 氏名 */}
            <section>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                氏名
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="例：楽天 太郎"
              />
            </section>

            {/* 電話番号 */}
            <section>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                電話番号
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="例：090-1234-5678"
              />
            </section>

            {/* メールアドレス */}
            <section className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="example@example.com"
                />
              </div>
              <div>
                <label htmlFor="emailConfirmation" className="block text-sm font-medium mb-1">
                  メールアドレス（確認用）
                </label>
                <input
                  id="emailConfirmation"
                  name="emailConfirmation"
                  type="email"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="もう一度入力してください"
                />
              </div>
            </section>

            {/* パスワード */}
            <section className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="8文字以上を推奨"
                />
              </div>
              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium mb-1">
                  パスワード（確認用）
                </label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="もう一度入力してください"
                />
              </div>
            </section>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{loading ? '登録中...' : '登録する'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}