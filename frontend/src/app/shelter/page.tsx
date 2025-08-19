import Layout from '@/components/Layout';

export default function ShelterStatusPage() {
  return (
    <Layout>
    <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">避難所状況入力</h1>
          <p className="text-sm text-foreground/70 mt-1">
            現在の状況をアンケート形式で回答してください。
          </p>
        </div>

          <form className="space-y-10" noValidate>
            {/* --- 避難者・怪我人の人数 --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="evacueeCount" className="block text-base font-medium mb-2">
                  Q1. 避難人数は？
                </label>
                <input
                  id="evacueeCount"
                  name="evacueeCount"
                  type="number"
                  inputMode="numeric"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="半角数字で入力"
                />
              </div>
              <div>
                <label htmlFor="injuredCount" className="block text-base font-medium mb-2">
                  Q2. けが人数は？
                </label>
                <input
                  id="injuredCount"
                  name="injuredCount"
                  type="number"
                  inputMode="numeric"
                  required
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="半角数字で入力"
                />
              </div>
            </section>

            {/* --- ライフラインの状況 --- */}
            <section>
               <h2 className="block text-base font-medium mb-3">Q3. ライフラインの状況は？</h2>
               <div className="space-y-3 pl-2">
                  {/* 電気 */}
                  <div className="flex items-center gap-x-10">
                      <span className="w-16">電気は？</span>
                      <div className="flex items-center gap-x-6">
                          <div className="flex items-center gap-x-2">
                              <input id="elec-ok" name="electricity" type="radio" className="h-4 w-4" />
                              <label htmlFor="elec-ok" className="text-sm">利用可能</label>
                          </div>
                          <div className="flex items-center gap-x-2">
                              <input id="elec-ng" name="electricity" type="radio" className="h-4 w-4" />
                              <label htmlFor="elec-ng" className="text-sm">停止中</label>
                          </div>
                      </div>
                  </div>
                  {/* ガス */}
                  <div className="flex items-center gap-x-10">
                      <span className="w-16">ガスは？</span>
                      <div className="flex items-center gap-x-6">
                          <div className="flex items-center gap-x-2">
                              <input id="gas-ok" name="gas" type="radio" className="h-4 w-4" />
                              <label htmlFor="gas-ok" className="text-sm">利用可能</label>
                          </div>
                          <div className="flex items-center gap-x-2">
                              <input id="gas-ng" name="gas" type="radio" className="h-4 w-4" />
                              <label htmlFor="gas-ng" className="text-sm">停止中</label>
                          </div>
                      </div>
                  </div>
                  {/* 水道 */}
                  <div className="flex items-center gap-x-10">
                      <span className="w-16">水道は？</span>
                      <div className="flex items-center gap-x-6">
                          <div className="flex items-center gap-x-2">
                              <input id="water-ok" name="water" type="radio" className="h-4 w-4" />
                              <label htmlFor="water-ok" className="text-sm">利用可能</label>
                          </div>
                          <div className="flex items-center gap-x-2">
                              <input id="water-ng" name="water" type="radio" className="h-4 w-4" />
                              <label htmlFor="water-ng" className="text-sm">停止中</label>
                          </div>
                      </div>
                  </div>
               </div>
            </section>

            {/* --- 周囲の交通情報 --- */}
            <section>
              <h2 className="block text-base font-medium mb-3">Q4. 周囲の交通情報は？</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 pl-2">
                  <div className="flex items-center gap-x-2">
                      <input id="traffic-ok" name="traffic" type="radio" className="h-4 w-4" />
                      <label htmlFor="traffic-ok" className="text-sm">問題なし</label>
                  </div>
                  <div className="flex items-center gap-x-2">
                      <input id="traffic-restricted" name="traffic" type="radio" className="h-4 w-4" />
                      <label htmlFor="traffic-restricted" className="text-sm">一部規制あり</label>
                  </div>
                  <div className="flex items-center gap-x-2">
                      <input id="traffic-closed" name="traffic" type="radio" className="h-4 w-4" />
                      <label htmlFor="traffic-closed" className="text-sm">通行止め</label>
                  </div>
              </div>
            </section>

            {/* 更新ボタン */}
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
                <span>回答を送信</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}