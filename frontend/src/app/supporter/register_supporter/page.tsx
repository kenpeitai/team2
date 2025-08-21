"use client";
import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
// API関数と型定義を外部ファイルからインポートする想定
import { registerUser } from '@/lib/api'; 
import type { ApiError, UserDto } from '@/types/api';

// ===== 状態管理の型定義 (RegisterPageの構造に統一) =====
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

// ===== State管理のためのReducer (RegisterPageの構造に統一) =====
const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload, errors: null };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload, message: null };
    case 'RESET':
      return { loading: false, message: null, errors: null };
    default:
      return state;
  }
};

// ===== メインコンポーネント =====
export default function RegisterSupporterPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(registerReducer, {
    loading: false,
    message: null,
    errors: null
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 状態をリセットして送信開始
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: null });
    dispatch({ type: 'SET_ERRORS', payload: null });

    const form = new FormData(e.currentTarget);
    const getStr = (key: string) => (form.get(key) as string) || '';

    // フロントエンドでのバリデーション
    if (getStr('password') !== getStr('passwordConfirmation')) {
      dispatch({ type: 'SET_MESSAGE', payload: 'パスワードが一致しません。' });
      dispatch({ type: 'SET_LOADING', payload: false }); // ローディングを解除
      return;
    }
    if (getStr('email') !== getStr('emailConfirmation')) {
      dispatch({ type: 'SET_MESSAGE', payload: 'メールアドレスが一致しません。' });
      dispatch({ type: 'SET_LOADING', payload: false }); // ローディングを解除
      return;
    }

    const body: UserDto = {
      fullName: getStr('fullName'),
      phoneNumber: getStr('phoneNumber'),
      username: getStr('email'),
      email: getStr('email'),
      password: getStr('password'),
    };

    try {
      const response = await registerUser(body);
      
      const successMessage = response.user?.fullName
        ? `${response.user.fullName}さん、登録が完了しました。`
        : '登録が完了しました。';
        
      dispatch({ type: 'SET_MESSAGE', payload: successMessage });
      
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      
      setTimeout(() => {
        router.push('/supporter/home');
      }, 2000);

    } catch (err) {
      const apiErr = err as ApiError;
      // バックエンドからの詳細なエラーメッセージがあれば表示
      dispatch({ type: 'SET_MESSAGE', payload: apiErr.message ?? '登録に失敗しました。' });
    } finally {
      // 成功・失敗に関わらずローディングを確実に解除
      dispatch({ type: 'SET_LOADING', payload: false });
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
            {/* フォームの各項目は変更ありません */}
            <section>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">氏名</label>
              <input id="fullName" name="fullName" type="text" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="例：楽天 太郎"/>
            </section>
            <section>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">電話番号</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" inputMode="tel" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="例：090-1234-5678"/>
            </section>
            <section className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">メールアドレス</label>
                <input id="email" name="email" type="email" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="example@example.com"/>
              </div>
              <div>
                <label htmlFor="emailConfirmation" className="block text-sm font-medium mb-1">メールアドレス（確認用）</label>
                <input id="emailConfirmation" name="emailConfirmation" type="email" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="もう一度入力してください"/>
              </div>
            </section>
            <section className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">パスワード</label>
                <input id="password" name="password" type="password" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="8文字以上を推奨"/>
              </div>
              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium mb-1">パスワード（確認用）</label>
                <input id="passwordConfirmation" name="passwordConfirmation" type="password" required className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30" placeholder="もう一度入力してください"/>
              </div>
            </section>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={state.loading}
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full disabled:opacity-60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                <span>{state.loading ? '登録中...' : '登録する'}</span>
              </button>
            </div>
          </form>

          {/* メッセージ表示エリア */}
          {state.message && (
            <p className="text-sm mt-4">{state.message}</p>
          )}
          {/* エラー詳細表示エリアを追加 */}
          {state.errors && (
            <ul className="text-sm mt-4 list-disc pl-6 text-red-600">
              {Object.entries(state.errors).map(([key, value]) => (
                <li key={key}>{`${key}: ${value}`}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}