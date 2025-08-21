'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import StatCard from './components/StatCard';
import Layout from '@/components/Layout';
import { useShelter } from '@/hooks/useShelter';
import { getShelterStatus } from '@/lib/api/shelterStatus';
import type { ShelterStatusDto } from '@/types/api';

export default function Home() {
  const params = useParams();
  const id = params.id as string;
  const { shelter } = useShelter();
  const [status, setStatus] = useState<ShelterStatusDto | null>(null);

  useEffect(() => {
    const shelterId = Number(id);

    const fetchStatus = () => {
      getShelterStatus(shelterId)
        .then((data) => {
          setStatus(data);
        })
        .catch((err) => {
          const statusCode = (err as { cause?: { status?: number } } | undefined)?.cause?.status;
          if (statusCode === 404) {
            setStatus(null);
            return;
          }
          setStatus(null);
        });
    };
    fetchStatus();
  }, [id]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* ページタイトル */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">{shelter?.shelterName ?? '災害支援システム'}</h1>
          <p className="text-gray-600 mt-2">{shelter?.shelterAddress ? `住所: ${shelter.shelterAddress}` : `避難所ID: ${id} の状況と支援情報を管理します`}</p>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-6">
          {/* 避難者・怪我人状況 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">避難者・怪我人状況</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="総避難者数"
                value={status?.evacueeCount ?? 0}
                icon="👥"
                bgColor="bg-red-100"
                textColor="text-red-600"
              />
              <StatCard
                title="怪我人"
                value={status?.injuredCount ?? 0}
                icon="🏥"
                bgColor="bg-orange-100"
                textColor="text-orange-600"
              />
            </div>
            <div className="mt-4 text-right">
              <p className="text-sm text-gray-500">最終更新: {status?.updatedAt ? new Date(status.updatedAt).toLocaleString('ja-JP', { hour12: false }) : '-'}</p>
            </div>
          </div>

          {/* 必要物資アクション（確認 or 新規注文） */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">必要物資</h2>
              <p className="text-sm text-gray-600 mt-1">いまの状況確認と、新規の注文作成</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <span className="text-2xl leading-none">📦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">必要物資リスト</h3>
                  <p className="text-gray-600 mt-1">現在の注文状況の確認や、新規注文の作成ができます。</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* 今の注文を確認 → supplies-status */}
                <Link
                  href={`/shelter/${id}/supplies-status`}
                  className="group rounded-xl border bg-white p-5 transition-all ring-1 ring-gray-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-700">いまの注文を確認</div>
                        <div className="text-sm text-gray-600 mt-0.5">カテゴリ別・優先度・検索で絞り込み</div>
                      </div>
                    </div>
                    <div className="mt-1 text-gray-300 transition-colors group-hover:text-blue-500">→</div>
                  </div>
                </Link>

                {/* 新しく注文する → supplies */}
                <Link
                  href={`/shelter/${id}/supplies`}
                  className="group rounded-xl border bg-white p-5 transition-all ring-1 ring-gray-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="ont-medium text-gray-900 group-hover:text-blue-700">新しく注文する</div>
                        <div className="text-sm opacity-90 mt-0.5">不足している物資を申請・送信</div>
                      </div>
                    </div>
                    <div className="mt-1 opacity-90">→</div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* 在庫管理・避難所状況（元のカードを残す） */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">在庫・その他メニュー</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MenuCard
                href={status ? `/shelter/${id}/shelter-status` : `/shelter/${id}/shelter-input`}
                title="避難所状況"
                description={status ? "避難所状況の登録・更新" : "避難所状況の新規登録"}
                icon="🏠"
                color="bg-blue-500"
              />
              <MenuCard
                href={`/shelter/${id}/supplies`}
                title="必要物資リスト"
                description="必要物資の登録・確認"
                icon="📦"
                color="bg-green-500"
              />
              <MenuCard
                href={`/shelter/${id}/inventory`}
                title="在庫管理"
                description="物資の在庫状況管理"
                icon="📊"
                color="bg-orange-500"
              />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
