"use client";
import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { createShelter } from '@/lib/api';
import type { ApiError, ShelterDto } from '@/types/api';

type RegisterState = {
  loading: boolean;
  message: string | null;
  errors: Record<string, string> | null;
};

type RegisterAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string | null }
  | { type: 'SET_ERRORS'; payload: Record<string, string> | null }
  | { type: 'RESET' };

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET':
      return { loading: false, message: null, errors: null };
    default:
      return state;
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(registerReducer, {
    loading: false,
    message: null,
    errors: null
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: null });
    dispatch({ type: 'SET_ERRORS', payload: null });

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

    try {
      await createShelter(body);
      dispatch({ type: 'SET_MESSAGE', payload: '登録が完了しました' });
      // フォームのリセット処理を安全に行う
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      // 登録成功後、home画面に遷移
      setTimeout(() => {
        router.push('/shelter/home');
      }, 1500);
    } catch (err) {
      const apiErr = err as ApiError;
      dispatch({ type: 'SET_MESSAGE', payload: apiErr.message ?? '登録に失敗しました' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
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
            <button type="submit" disabled={state.loading} className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>{state.loading ? '送信中...' : '登録'}</span>
            </button>
          </div>
          {state.message && (
            <p className="text-sm mt-2">{state.message}</p>
          )}
          {state.errors && (
            <ul className="text-sm mt-2 list-disc pl-6">
              {Object.entries(state.errors).map(([k, v]) => (
                <li key={k}>{k}: {v}</li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
    </Layout>
  );
}


