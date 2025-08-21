'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShelter } from '@/hooks/useShelter';
import { ShelterStatusDto, UtilityStatus, TrafficStatus } from '@/types/api';
import Layout from '@/components/ShelterLayout';
import { updateShelterStatusRecord } from '@/lib/api/shelterStatus';
import BackButton from '@/components/BackButton';

type ShelterStatusForm = Omit<ShelterStatusDto, 'id' | 'shelterId' | 'createdAt' | 'updatedAt'>;

const DEFAULT_FORM: ShelterStatusForm = {
  evacueeCount: 0,
  injuredCount: 0,
  electricityStatus: UtilityStatus.AVAILABLE,
  gasStatus: UtilityStatus.AVAILABLE,
  waterStatus: UtilityStatus.AVAILABLE,
  trafficStatus: TrafficStatus.NORMAL,
};

const UTILITY_STATUS_OPTIONS: { value: UtilityStatus; label: string }[] = [
  { value: UtilityStatus.AVAILABLE, label: '利用可能' },
  { value: UtilityStatus.UNAVAILABLE, label: '停止中' },
];

const TRAFFIC_STATUS_OPTIONS: { value: TrafficStatus; label: string }[] = [
  { value: TrafficStatus.NORMAL, label: '通常' },
  { value: TrafficStatus.RESTRICTED, label: '一部規制あり' },
  { value: TrafficStatus.CLOSED, label: '通行止め' },
];

export default function ShelterInputPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { shelter, loading, error, refetch } = useShelter();

  const [formData, setFormData] = useState<ShelterStatusForm>(DEFAULT_FORM);
  const [evacueeInput, setEvacueeInput] = useState<string>('0');
  const [injuredInput, setInjuredInput] = useState<string>('0');

  const [submitting, setSubmitting] = useState(false);

  // 避難所データが取得できたらフォームに設定
  useEffect(() => {
    if (shelter) {
      setFormData({
        evacueeCount: shelter.evacueeCount ?? DEFAULT_FORM.evacueeCount,
        injuredCount: shelter.injuredCount ?? DEFAULT_FORM.injuredCount,
        electricityStatus: shelter.electricityStatus ?? DEFAULT_FORM.electricityStatus,
        gasStatus: shelter.gasStatus ?? DEFAULT_FORM.gasStatus,
        waterStatus: shelter.waterStatus ?? DEFAULT_FORM.waterStatus,
        trafficStatus: shelter.trafficStatus ?? DEFAULT_FORM.trafficStatus,
      });
      setEvacueeInput(String(shelter.evacueeCount ?? DEFAULT_FORM.evacueeCount));
      setInjuredInput(String(shelter.injuredCount ?? DEFAULT_FORM.injuredCount));
    }
  }, [shelter]);

  const handleInputChange = <K extends keyof ShelterStatusForm>(field: K, value: ShelterStatusForm[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    setSubmitting(true);
    const payload: ShelterStatusDto = {
      shelterId: parseInt(id),
      ...DEFAULT_FORM,
      ...formData,
    };
    updateShelterStatusRecord(parseInt(id), payload)
      .then(() => {
        router.push(`/shelter/${id}/shelter-status`);
      })
      .catch(() => {
        alert('更新に失敗しました');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // 全角→半角の数値正規化
  const toHalfWidthNumeric = (s: string) =>
    s
      .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xFEE0))
      .replace(/．/g, '.')
      .replace(/－/g, '-');

  if (loading) {
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

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              再試行
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!shelter) {
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
          <BackButton fallbackHref={`/shelter/${id}/home`} className="mb-6" />
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">避難所状況の更新</h1>
            <p className="text-sm text-gray-600 mt-1">
              {shelter.shelterName} の状況を更新してください
            </p>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
            
            {/* 避難者情報 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">避難者情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="evacueeCount" className="block text-sm font-medium text-gray-700 mb-2">
                    避難者数
                  </label>
                  <input
                    id="evacueeCount"
                    type="text"
                    inputMode="numeric"
                    value={evacueeInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setEvacueeInput(raw);
                      const normalized = toHalfWidthNumeric(raw).trim();
                      const num = normalized === '' ? 0 : Number(normalized);
                      if (!Number.isFinite(num) || num < 0) return;
                      handleInputChange('evacueeCount', num);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="injuredCount" className="block text-sm font-medium text-gray-700 mb-2">
                    けが人数
                  </label>
                  <input
                    id="injuredCount"
                    type="text"
                    inputMode="numeric"
                    value={injuredInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setInjuredInput(raw);
                      const normalized = toHalfWidthNumeric(raw).trim();
                      const num = normalized === '' ? 0 : Number(normalized);
                      if (!Number.isFinite(num) || num < 0) return;
                      handleInputChange('injuredCount', num);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <hr />

            {/* ライフライン状況 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">ライフラインの状況</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="electricityStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    電気
                  </label>
                  <select
                    id="electricityStatus"
                    value={formData.electricityStatus ?? UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('electricityStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {UTILITY_STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gasStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    ガス
                  </label>
                  <select
                    id="gasStatus"
                    value={formData.gasStatus ?? UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('gasStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {UTILITY_STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="waterStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    水道
                  </label>
                  <select
                    id="waterStatus"
                    value={formData.waterStatus ?? UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('waterStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {UTILITY_STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <hr />

            {/* 交通状況 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">交通状況</h2>
              <div>
                <label htmlFor="trafficStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  周囲の交通状況
                </label>
                <select
                  id="trafficStatus"
                  value={formData.trafficStatus ?? TrafficStatus.NORMAL}
                  onChange={(e) => handleInputChange('trafficStatus', e.target.value as TrafficStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TRAFFIC_STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/shelter/${id}/shelter-status`)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}