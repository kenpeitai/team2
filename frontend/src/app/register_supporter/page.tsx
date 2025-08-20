import Layout from '@/components/Layout';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-2">支援者情報登録</h1>
          <p className="text-sm text-foreground/70 mb-6">
            支援者として登録するために、以下の情報を入力してください。
          </p>

          <form className="space-y-8" noValidate>
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

            {/* クレジットカード情報 */}
            <section className="space-y-4">
              <span className="block text-sm font-medium">クレジットカード情報</span>
              <div>
                <label htmlFor="cardNumber" className="sr-only">
                  カード番号
                </label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  inputMode="numeric"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="カード番号"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cardExpiry" className="sr-only">
                    有効期限 (MM/YY)
                  </label>
                  <input
                    id="cardExpiry"
                    name="cardExpiry"
                    type="text"
                    required
                    className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                    placeholder="有効期限 (MM/YY)"
                  />
                </div>
                <div>
                  <label htmlFor="cardCvc" className="sr-only">
                    CVC
                  </label>
                  <input
                    id="cardCvc"
                    name="cardCvc"
                    type="text"
                    inputMode="numeric"
                    required
                    className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                    placeholder="CVC"
                  />
                </div>
              </div>
            </section>

            <div className="pt-2">
              <button
                type="submit" // フォーム送信のためtypeをsubmitに変更
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full"
              >
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
                <span>登録する</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}