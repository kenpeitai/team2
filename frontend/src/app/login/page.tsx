import Link from 'next/link';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('ログイン機能は現在モックです。実際のAPIと連携予定です。');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ログイン
            </h1>
            <p className="text-gray-600">
              アカウントにログインしてください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス入力 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="example@email.com"
                defaultValue="demo@example.com"
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
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="パスワードを入力"
                defaultValue="password123"
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
          </form>

          {/* 追加リンク */}
          <div className="mt-6 text-center">
            <Link 
              href="/register" 
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
