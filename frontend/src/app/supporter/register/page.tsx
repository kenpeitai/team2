"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/ShelterLayout';
import { registerUser } from '@/lib/api';
import type { ApiError, UserDto } from '@/types/api';
import { runValidation, required, minLengthN, emailFmt, phoneFmt, sameAs } from '@/lib/validation';

export default function RegisterSupporterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const getStr = (key: string) => ((form.get(key) as string) ?? '').toString();

    const values = {
      fullName: getStr('fullName'),
      phoneNumber: getStr('phoneNumber'),
      email: getStr('email'),
      emailConfirmation: getStr('emailConfirmation'),
      password: getStr('password'),
      passwordConfirmation: getStr('passwordConfirmation'),
    };

    const validationErrors = runValidation(values, {
      fullName: [required('氏名は必須です')],
      phoneNumber: [required('電話番号は必須です'), phoneFmt()],
      email: [required('メールアドレスは必須です'), emailFmt()],
      emailConfirmation: [required('メールアドレス（確認用）は必須です'), sameAs('email', 'メールアドレスが一致しません。')],
      password: [required('パスワードは必須です'), minLengthN(8, 'パスワードは8文字以上で入力してください')],
      passwordConfirmation: [required('パスワード（確認用）は必須です'), sameAs('password', 'パスワードが一致しません。')],
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // バックエンド互換: 一時的にusername必須のため自動生成して送信
    const username = (values.email.split('@')[0] || values.fullName || values.phoneNumber || 'user')
      .toString()
      .replace(/\s+/g, '')
      .slice(0, 50);

    const body: UserDto = {
      username,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      password: values.password,
    };

    try {
      const resp = await registerUser(body);
      const id = resp?.user?.id;
      if (id) {
        router.push(`/supporter/${id}/home`);
        return;
      }
      router.push('/supporter/home');
      return;
    } catch (err) {
      const maybe = err as unknown as { cause?: { details?: Record<string, string>; message?: string } };
      const cause = maybe?.cause;
      if (cause?.details) {
        setErrors(cause.details);
      } else {
        console.error((err as ApiError)?.message ?? '登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-2">支援者情報登録</h1>
          <p className="text-sm text-foreground/70 mb-6">
            支援者として登録するために、以下の情報を入力してください。
          </p>

          <form className="space-y-8" noValidate onSubmit={onSubmit}>
            <section>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">氏名</label>
              {errors.fullName && (
                <p className="text-sm text-red-600 mb-1">{errors.fullName}</p>
              )}
              <input id="fullName" name="fullName" type="text" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="例：楽天 太郎"/>
            </section>
            <section>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">電話番号</label>
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 mb-1">{errors.phoneNumber}</p>
              )}
              <input id="phoneNumber" name="phoneNumber" type="tel" inputMode="tel" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="例：090-1234-5678"/>
            </section>
            <section className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">メールアドレス</label>
                {errors.email && (
                  <p className="text-sm text-red-600 mb-1">{errors.email}</p>
                )}
                <input id="email" name="email" type="email" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="example@example.com"/>
              </div>
              <div>
                <label htmlFor="emailConfirmation" className="block text-sm font-medium mb-1">メールアドレス（確認用）</label>
                {errors.emailConfirmation && (
                  <p className="text-sm text-red-600 mb-1">{errors.emailConfirmation}</p>
                )}
                <input id="emailConfirmation" name="emailConfirmation" type="email" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="もう一度入力してください"/>
              </div>
            </section>
            <section className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">パスワード</label>
                {errors.password && (
                  <p className="text-sm text-red-600 mb-1">{errors.password}</p>
                )}
                <input id="password" name="password" type="password" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="8文字以上を推奨"/>
              </div>
              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium mb-1">パスワード（確認用）</label>
                {errors.passwordConfirmation && (
                  <p className="text-sm text-red-600 mb-1">{errors.passwordConfirmation}</p>
                )}
                <input id="passwordConfirmation" name="passwordConfirmation" type="password" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="もう一度入力してください"/>
              </div>
            </section>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                <span>{loading ? '登録中...' : '登録する'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}