'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShelter } from '@/hooks/useShelter';
import { updateShelterStatus } from '@/lib/api';
import { ShelterDto, UtilityStatus, TrafficStatus } from '@/types/api';
import Layout from '@/components/Layout';

export default function ShelterInputPage() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params.id as string;
  const { shelter, loading, error, refetch } = useShelter();

  const [formData, setFormData] = useState<Partial<ShelterDto>>({
    evacueeCount: 0,
    injuredCount: 0,
    electricityStatus: UtilityStatus.AVAILABLE,
    gasStatus: UtilityStatus.AVAILABLE,
    waterStatus: UtilityStatus.AVAILABLE,
    trafficStatus: TrafficStatus.NORMAL,
  });

  const [submitting, setSubmitting] = useState(false);

  // 避難所データが取得できたらフォームに設定
  useEffect(() => {
    if (shelter) {
      setFormData({
        evacueeCount: shelter.evacueeCount || 0,
        injuredCount: shelter.injuredCount || 0,
        electricityStatus: shelter.electricityStatus || UtilityStatus.AVAILABLE,
        gasStatus: shelter.gasStatus || UtilityStatus.AVAILABLE,
        waterStatus: shelter.waterStatus || UtilityStatus.AVAILABLE,
        trafficStatus: shelter.trafficStatus || TrafficStatus.NORMAL,
      });
    }
  }, [shelter]);

  const handleInputChange = (field: keyof ShelterDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shelter) {
      alert('避難所情報が取得できませんでした');
      return;
    }

    try {
      setSubmitting(true);
      await updateShelterStatus(parseInt(shelterId), formData as ShelterDto);
      alert('避難所情報が更新されました');
      router.push(`/shelter/${shelterId}/shelter_status`);
    } catch (err) {
      console.error('更新に失敗しました:', err);
      alert('更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    避難者数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.evacueeCount || 0}
                    onChange={(e) => handleInputChange('evacueeCount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    けが人数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.injuredCount || 0}
                    onChange={(e) => handleInputChange('injuredCount', parseInt(e.target.value) || 0)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電気
                  </label>
                  <select
                    value={formData.electricityStatus || UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('electricityStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={UtilityStatus.AVAILABLE}>利用可能</option>
                    <option value={UtilityStatus.UNAVAILABLE}>停止中</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ガス
                  </label>
                  <select
                    value={formData.gasStatus || UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('gasStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={UtilityStatus.AVAILABLE}>利用可能</option>
                    <option value={UtilityStatus.UNAVAILABLE}>停止中</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    水道
                  </label>
                  <select
                    value={formData.waterStatus || UtilityStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('waterStatus', e.target.value as UtilityStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={UtilityStatus.AVAILABLE}>利用可能</option>
                    <option value={UtilityStatus.UNAVAILABLE}>停止中</option>
                  </select>
                </div>
              </div>
            </section>

            <hr />

            {/* 交通状況 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">交通状況</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  周囲の交通状況
                </label>
                <select
                  value={formData.trafficStatus || TrafficStatus.NORMAL}
                  onChange={(e) => handleInputChange('trafficStatus', e.target.value as TrafficStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={TrafficStatus.NORMAL}>通常</option>
                  <option value={TrafficStatus.RESTRICTED}>一部規制あり</option>
                  <option value={TrafficStatus.CLOSED}>通行止め</option>
                </select>
              </div>
            </section>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/shelter/${shelterId}/shelter_status`)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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