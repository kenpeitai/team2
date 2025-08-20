'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import StatCard from './components/StatCard';
import SupportTable from './components/SupportTable';
import RecentActivities from './components/RecentActivities';
import Layout from '@/components/Layout';

export default function Home() {
  const params = useParams();
  const shelterId = params.id as string;

  const supportData = [
    { supporter: '田中建設株式会社', support: '避難所のテント設営', date: '2024-01-15' },
    { supporter: '地域ボランティアグループ', support: '食料品の配給支援', date: '2024-01-15' },
    { supporter: '医療チームA', support: '健康診断・医療支援', date: '2024-01-14' },
    { supporter: '運輸会社B', support: '物資の輸送支援', date: '2024-01-14' },
    { supporter: '地域消防署', support: '安全確認・巡回', date: '2024-01-13' },
  ];

  const evacuationData = {
    totalEvacuees: 156,
    injuredPeople: 23,
    lastUpdated: '2024-01-15 14:30',
  };

  const recentActivities = [
    { message: '避難所状況が更新されました', time: '2時間前', color: 'bg-green-500' },
    { message: '必要物資リストが更新されました', time: '4時間前', color: 'bg-blue-500' },
    { message: '在庫管理が更新されました', time: '6時間前', color: 'bg-orange-500' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* ページタイトル */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">災害支援システム</h1>
          <p className="text-gray-600 mt-2">
            避難所ID: {shelterId} の状況と支援情報を管理します
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-6">
          {/* 避難者・怪我人状況 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">避難者・怪我人状況</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="総避難者数"
                value={evacuationData.totalEvacuees}
                icon="👥"
                bgColor="bg-red-100"
                textColor="text-red-600"
              />
              <StatCard
                title="怪我人"
                value={evacuationData.injuredPeople}
                icon="🏥"
                bgColor="bg-orange-100"
                textColor="text-orange-600"
              />
            </div>
            <div className="mt-4 text-right">
              <p className="text-sm text-gray-500">最終更新: {evacuationData.lastUpdated}</p>
            </div>
          </div>

          {/* 支援状況サマリー */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">支援状況サマリー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard title="支援記録数" value="5" icon="📋" bgColor="bg-blue-100" textColor="text-blue-600" />
              <StatCard title="支援者数" value="5" icon="👥" bgColor="bg-purple-100" textColor="text-purple-600" />
            </div>
          </div>

          {/* 支援履歴テーブル */}
          <SupportTable supportData={supportData} />

          {/* 必要物資アクション（確認 or 新規注文） */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">必要物資</h2>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-start gap-3">
                <div className="text-2xl leading-none rounded-md text-white bg-green-500 w-10 h-10 flex items-center justify-center">
                  📦
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">必要物資リスト</h3>
                  <p className="text-gray-600 mt-1">現在の注文状況を確認、または新規注文を作成</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 今の注文を確認 → supplies_status */}
                <Link
                  href="/shelter/supplies_status"
                  className="group rounded-xl border px-4 py-4 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">📋</div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:underline">いまの注文を確認</div>
                      <div className="text-sm text-gray-600 mt-0.5">カテゴリ別・優先度・検索で絞り込み</div>
                    </div>
                  </div>
                </Link>

                {/* 新しく注文する → supplies */}
                <Link
                  href="/shelter/supplies"
                  className="group rounded-xl border px-4 py-4 bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">🆕</div>
                    <div>
                      <div className="font-medium group-hover:underline">新しく注文する</div>
                      <div className="text-sm opacity-90 mt-0.5">不足している物資を申請・送信</div>
                    </div>
                  </div>
                </Link>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                ※ 誤タップ防止のためカード全体クリックは無効、アクションのみクリック可。
              </p>
            </div>
          </section>

          {/* 在庫管理・避難所状況（元のカードを残す） */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">在庫・その他メニュー</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MenuCard
                href={`/shelter/${shelterId}/shelter_status`}
                title="避難所状況"
                description="避難所状況の登録・更新"
                icon="🏠"
                color="bg-blue-500"
              />
              <MenuCard
                href={`/shelter/${shelterId}/supplies`}
                title="必要物資リスト"
                description="必要物資の登録・確認"
                icon="📦"
                color="bg-green-500"
              />
              <MenuCard
                href={`/shelter/${shelterId}/inventory`}
                title="在庫管理"
                description="物資の在庫状況管理"
                icon="📊"
                color="bg-orange-500"
              />
            </div>
          </section>

          {/* 最近の活動 */}
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </Layout>
  );
}
