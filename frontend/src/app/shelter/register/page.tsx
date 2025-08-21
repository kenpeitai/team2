"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { createShelter } from '@/lib/api';
import { runValidation, required, minLengthN, emailFmt, phoneFmt } from '@/lib/validation';
import type { ApiError, ShelterDto } from '@/types/api';

function validateShelterInput(body: ShelterDto): Record<string, string> {
  return runValidation(body, {
    shelterName: [required('避難所名は必須です')],
    shelterAddress: [required('住所は必須です')],
    representativeLastName: [required('苗字は必須です')],
    representativeFirstName: [required('名は必須です')],
    phoneNumber: [required('電話番号は必須です'), phoneFmt()],
    email: [required('メールアドレスは必須です'), emailFmt()],
    password: [required('パスワードは必須です'), minLengthN(8, 'パスワードは8文字以上で入力してください')],
  });
}

function extractErrorsFromApiError(err: unknown): Record<string, string> {
  const apiErr = err as ApiError;
  const maybe = apiErr as unknown as { cause?: { status?: number; message?: string; details?: Record<string, string> } };
  const cause = maybe?.cause;
  if (cause?.details) return cause.details;
  if (cause?.status === 409 && cause?.message) {
    const duplicateErrors: Record<string, string> = {};
    if (cause.message.includes('メールアドレス')) duplicateErrors.email = cause.message;
    if (cause.message.includes('避難所名')) duplicateErrors.shelterName = cause.message;
    return duplicateErrors;
  }
  return {};
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const getStr = (key: string) => {
      const v = form.get(key);
      return typeof v === 'string' ? v : '';
    };
    const body: ShelterDto = {
      shelterName: getStr('shelterName'),
      shelterAddress: getStr('shelterAddress'),
      representativeLastName: getStr('representativeLastName'),
      representativeFirstName: getStr('representativeFirstName'),
      phoneNumber: getStr('phoneNumber'),
      email: getStr('email'),
      password: getStr('password'),
    };

    const clientErrors = validateShelterInput(body);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setLoading(false);
      return;
    }

    createShelter(body)
      .then((created) => {
        const id = created?.id;
        if (id) {
          router.push(`/shelter/${id}/home`);
        }
      })
      .catch((err) => {
        setErrors(extractErrorsFromApiError(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Layout>
    <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">新規登録</h1>
        <p className="text-sm text-foreground/70 mb-6">避難所情報登録</p>

        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          <section className="space-y-4">
            <div>
              <label htmlFor="shelterName" className="block text-sm font-medium mb-1">
                避難所名
              </label>
              {errors?.shelterName && (
                <p className="text-sm text-red-600 mb-1">{errors.shelterName}</p>
              )}
              <input
                id="shelterName"
                name="shelterName"
                type="text"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="例：〇〇小学校 体育館"
              />
            </div>

            <div>
              <label htmlFor="shelterAddress" className="block text-sm font-medium mb-1">
                避難所の住所
              </label>
              {errors?.shelterAddress && (
                <p className="text-sm text-red-600 mb-1">{errors.shelterAddress}</p>
              )}
              <input
                id="shelterAddress"
                name="shelterAddress"
                type="text"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="例：東京都〇〇区〇〇 1-2-3"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <span className="block text-sm font-medium mb-1">代表者名</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="representativeLastName" className="sr-only">
                    苗字
                  </label>
                  {errors?.representativeLastName && (
                    <p className="text-sm text-red-600 mb-1">{errors.representativeLastName}</p>
                  )}
                  <input
                    id="representativeLastName"
                    name="representativeLastName"
                    type="text"
                    required
                    className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                    placeholder="苗字"
                  />
                </div>
                <div>
                  <label htmlFor="representativeFirstName" className="sr-only">
                    名
                  </label>
                  {errors?.representativeFirstName && (
                    <p className="text-sm text-red-600 mb-1">{errors.representativeFirstName}</p>
                  )}
                  <input
                    id="representativeFirstName"
                    name="representativeFirstName"
                    type="text"
                    required
                    className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                    placeholder="名"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                電話番号
              </label>
              {errors?.phoneNumber && (
                <p className="text-sm text-red-600 mb-1">{errors.phoneNumber}</p>
              )}
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="例：03-1234-5678"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                メールアドレス
              </label>
              {errors?.email && (
                <p className="text-sm text-red-600 mb-1">{errors.email}</p>
              )}
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
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                パスワード
              </label>
              {errors?.password && (
                <p className="text-sm text-red-600 mb-1">{errors.password}</p>
              )}
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                placeholder="8文字以上を推奨"
              />
            </div>
          </section>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>{loading ? '送信中...' : '登録'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
}


