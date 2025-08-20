"use client"; // useStateを使うため、クライアントコンポーネントとして宣言

import { useState } from 'react';
import Layout from '@/components/Layout';

// --- サンプルデータ ---

// 上部に表示する避難所の一覧
const sheltersList = [
  { id: 1, name: '中区役所', address: '愛知県名古屋市中区栄四丁目1番8号', imageUrl: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Shelter+1' },
  { id: 2, name: '中村スポーツセンター', address: '愛知県名古屋市中村区中村町字待屋43番地の1', imageUrl: 'https://placehold.co/600x400/dbeafe/1e3a8a?text=Shelter+2' },
  { id: 3, name: '東生涯学習センター', address: '愛知県名古屋市東区葵一丁目3番21号', imageUrl: 'https://placehold.co/600x400/d1fae5/065f46?text=Shelter+3' },
];

// 下部に表示する「あなた」の支援状況データ（今回はこれを固定で表示）
const activeSupport = {
  supportedShelterName: '中村スポーツセンター', // 支援中の避難所名
  itemName: '医薬品セット',
  status: 'delivery_drone', // 'purchased', 'delivery_truck', 'delivered', 'received'
};
const notifications = [{ id: 1, message: '先日いただいた医薬品、本当に助かりました。ありがとうございます！' }];


// --- 1ページに統合したコンポーネント ---
export default function SupportPage() {
  // 現在リストで選択（ハイライト）されている避難所を記憶する場所
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-10">
        <div className="space-y-12">

          {/* --- 上段：避難所一覧 --- */}
          <section>
            <h1 className="text-2xl font-semibold mb-2">避難所一覧</h1>
            <p className="text-sm text-foreground/70 mb-8">支援する避難所を選択してください。</p>
            <div className="space-y-4">
              {sheltersList.map((shelter) => {
                const isSelected = selectedShelterId === shelter.id;
                return (
                  <div
                    key={shelter.id}
                    onClick={() => setSelectedShelterId(shelter.id)}
                    className={`rounded-lg border flex flex-col sm:flex-row items-center gap-4 p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                        // ▼▼▼ ここを修正しました ▼▼▼
                        : 'border-black/10 dark:border-white/20 hover:shadow-md'
                    }`}
                  >
                    <img src={shelter.imageUrl} alt={shelter.name} className="w-full sm:w-24 h-24 sm:h-auto object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-md font-bold">{shelter.name}</h3>
                      <p className="text-xs text-foreground/80 mt-1">{shelter.address}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* --- 区切り線 --- */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* --- 下段：あなたの支援状況ダッシュボード --- */}
          <section>
            <h1 className="text-2xl font-semibold mb-2">あなたの支援状況</h1>
            <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              支援先：{activeSupport.supportedShelterName}
            </p>
            
            <div className="space-y-10 mt-8">
              {/* 1. 最新の支援状況 */}
              <section>
                <h2 className="text-lg font-semibold mb-3">最新の支援状況：{activeSupport.itemName}</h2>
                <div className="p-4 rounded-lg border border-black/10 dark:border-white/20">
                  <div className="flex justify-between items-center text-xs text-center mb-4">
                    <div className="opacity-100 font-semibold">✅<br/>購入完了</div>
                    <div className={activeSupport.status.startsWith('delivery') ? 'opacity-100 font-semibold' : 'opacity-40'}>🚚<br/>配送中</div>
                    <div className={activeSupport.status === 'delivered' || activeSupport.status === 'received' ? 'opacity-100 font-semibold' : 'opacity-40'}>📦<br/>避難所到着</div>
                    <div className={activeSupport.status === 'received' ? 'opacity-100 font-semibold' : 'opacity-40'}>🙌<br/>受取完了</div>
                  </div>
                </div>
              </section>
              {/* 2. 避難所からの通知 */}
              <section>
                <h2 className="text-lg font-semibold mb-3">避難所からの通知</h2>
                {notifications.map((note) => (
                  <div key={note.id} className="p-4 rounded-lg border border-black/10 dark:border-white/20 flex items-start gap-3">
                    <span className="text-xl">💌</span>
                    <p className="text-sm">{note.message}</p>
                  </div>
                ))}
              </section>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}