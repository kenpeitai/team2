import Layout from '@/components/Layout';

export default function RegisterPage() {
  return (
    <Layout>
    <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">新規登録</h1>
        <p className="text-sm text-foreground/70 mb-6">避難所情報登録</p>

        <form className="space-y-6" noValidate>
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
            <button type="button" className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>登録</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
}


