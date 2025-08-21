"use client"; // Next.jsのApp Router環境で必要になる場合があります

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShelter } from '@/hooks/useShelter';
import Layout from '@/components/Layout';
import { getShelterStatus } from '@/lib/api/shelterStatus';
import type { ShelterStatusDto } from '@/types/api';
import { UtilityStatus, TrafficStatus } from '@/types/api';
import BackButton from '@/components/BackButton';

const utilityStatusLabel: Record<UtilityStatus, string> = {
  [UtilityStatus.AVAILABLE]: '利用可',
  [UtilityStatus.UNAVAILABLE]: '停止中',
  [UtilityStatus.UNKNOWN]: '不明',
};

const trafficStatusLabel: Record<TrafficStatus, string> = {
  [TrafficStatus.NORMAL]: '通常',
  [TrafficStatus.RESTRICTED]: '一部規制あり',
  [TrafficStatus.CLOSED]: '通行止め',
  [TrafficStatus.UNKNOWN]: '不明',
};

const toUtilityLabel = (value?: UtilityStatus) => (value ? utilityStatusLabel[value] ?? '不明' : '不明');
const toTrafficLabel = (value?: TrafficStatus) => (value ? trafficStatusLabel[value] ?? '不明' : '不明');

// --- コンポーネント本体 ---
export default function ShelterStatusPage() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.id as string;
  const { shelter, loading, error, refetch } = useShelter();

  const [status, setStatus] = useState<ShelterStatusDto | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const fetchStatus = async () => {
    const idNum = Number(shelterId);
    setStatusLoading(true);
    setStatusError(null);
    getShelterStatus(idNum)
      .then((data) => {
        setStatus(data);
      })
      .catch(() => {
        setStatusError('避難所状況の取得に失敗しました');
        setStatus(null);
      })
      .finally(() => {
        setStatusLoading(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shelterId]);

  // 「修正する」ボタンが押されたときの動作
  const handleEditClick = () => {
    // 避難所入力ページに遷移
    router.push(`/shelter/${shelterId}/shelter-input`);
  };

  if (loading || statusLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">避難所情報を読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || statusError) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{statusError || error}</p>
            <button 
              onClick={() => {
                void refetch();
                void fetchStatus();
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              再試行
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!shelter || !status) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">避難所が見つかりません</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <BackButton fallbackHref={`/shelter/${shelterId}/home`} className="mb-6" />
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">避難所の状況</h1>
            <p className="text-sm text-gray-600 mt-1">{shelter?.shelterName || '避難所'} の現在の状況です。</p>
          </div>

          {/* --- 表示エリア --- */}
          <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
            
            {/* 避難状況 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-3">避難状況</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">避難人数</p>
                  <p className="text-xl font-bold">{status.evacueeCount ?? 0} 人</p>
                </div>
                <div>
                  <p className="text-sm font-medium">けが人数</p>
                  <p className="text-xl font-bold">{status.injuredCount ?? 0} 人</p>
                </div>
              </div>
            </section>

            <hr />

            {/* ライフラインの状況 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-3">ライフラインの状況</h2>
              <div className="space-y-2 text-base">
                <p>電気：<span className="font-bold ml-2">{toUtilityLabel(status.electricityStatus)}</span></p>
                <p>ガス：<span className="font-bold ml-2">{toUtilityLabel(status.gasStatus)}</span></p>
                <p>水道：<span className="font-bold ml-2">{toUtilityLabel(status.waterStatus)}</span></p>
              </div>
            </section>

            <hr />

            {/* 交通情報 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">周囲の交通情報</h2>
              <p className="text-base font-bold">{toTrafficLabel(status.trafficStatus)}</p>
            </section>
          </div>
          
          {/* 更新ボタン */}
          <div className="pt-2">
            <button 
              type="button" 
              className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full"
              onClick={handleEditClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>内容を修正する</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
