'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

// --- 仮のコンポーネント（本来は別ファイルに定義） ---
// 避難所ホームのレイアウトを参考にしたUIコンポーネント

// 数値を表示するカード
type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
};

const StatCard = ({ title, value, icon, bgColor, textColor }: StatCardProps) => (
  <div className={`p-4 rounded-lg shadow flex items-center ${bgColor}`}>
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <p className={`text-sm font-medium ${textColor}`}>{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// 避難所を選択するためのカード
type Shelter = {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
};

type ShelterMenuCardProps = {
  shelter: Shelter;
  onSelect: (shelter: Shelter) => void;
  isSelected: boolean;
};

const ShelterMenuCard = ({ shelter, onSelect, isSelected }: ShelterMenuCardProps) => (
  <div 
    onClick={() => onSelect(shelter)}
    className={`rounded-lg shadow overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-4 ring-blue-400' : 'hover:shadow-lg'}`}
  >
    <img src={shelter.imageUrl} alt={shelter.name} className="w-full h-32 object-cover" />
    <div className="p-4 bg-white">
      <h3 className="font-bold text-gray-800">{shelter.name}</h3>
      <p className="text-xs text-gray-600 mt-1">{shelter.address}</p>
    </div>
  </div>
);


// --- 支援者ホーム ---

export default function SupporterHomePage() {
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);

  // --- サンプルデータ ---
  const sheltersList = [
    { id: 1, name: '中区役所', address: '愛知県名古屋市中区栄四丁目1番8号', imageUrl: 'https://placehold.co/600x400/e2e8f0/4a5568?text=Shelter+1' },
    { id: 2, name: '中村スポーツセンター', address: '愛知県名古屋市中村区中村町字待屋43番地の1', imageUrl: 'https://placehold.co/600x400/dbeafe/1e3a8a?text=Shelter+2' },
    { id: 3, name: '東生涯学習センター', address: '愛知県名古屋市東区葵一丁目3番21号', imageUrl: 'https://placehold.co/600x400/d1fae5/065f46?text=Shelter+3' },
  ];
  const activeSupport = { supportedShelterName: '中村スポーツセンター', itemName: '医薬品セット', status: 'delivery_drone' };
  const recentNotifications = [{ message: '中村スポーツセンターから感謝の通知が届きました', time: '1日前', color: 'bg-green-500' }];
  const stats = { ongoing: 1, completed: 4, totalAmount: '¥18,200' };

  return (
    <Layout>
      <div className="space-y-8">
        {/* ページタイトル */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">支援者ポータル</h1>
          <p className="text-gray-600 mt-2">あなたの支援活動状況の確認や、新たな支援先の検索ができます。</p>
        </div>

        {/* 支援サマリー */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">あなたの支援サマリー</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="進行中の支援" value={stats.ongoing} icon="🚚" bgColor="bg-blue-100" textColor="text-blue-600" />
            <StatCard title="完了した支援" value={stats.completed} icon="✅" bgColor="bg-green-100" textColor="text-green-600" />
            <StatCard title="支援総額（目安）" value={stats.totalAmount} icon="💰" bgColor="bg-yellow-100" textColor="text-yellow-600" />
            <StatCard title="未読の通知" value={recentNotifications.length} icon="💌" bgColor="bg-purple-100" textColor="text-purple-600" />
          </div>
        </div>

        {/* 現在の支援状況 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">進行中の支援状況</h2>
          <p className="text-sm mb-4">現在、**{activeSupport.supportedShelterName}**へ**{activeSupport.itemName}**を支援中です。</p>
          <div className="flex justify-between items-center text-xs text-center">
            <div className="opacity-100 font-semibold">✅<br/>購入完了</div>
            <div className={activeSupport.status.startsWith('delivery') ? 'opacity-100 font-semibold' : 'opacity-40'}>🚚<br/>配送中</div>
            <div className={activeSupport.status === 'delivered' || activeSupport.status === 'received' ? 'opacity-100 font-semibold' : 'opacity-40'}>📦<br/>避難所到着</div>
            <div className={activeSupport.status === 'received' ? 'opacity-100 font-semibold' : 'opacity-40'}>🙌<br/>受取完了</div>
          </div>
        </div>

        {/* 機能メニュー（避難所一覧） */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">新たな支援先を探す</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheltersList.map((shelter) => (
              <ShelterMenuCard
                key={shelter.id}
                shelter={shelter}
                onSelect={() => setSelectedShelterId(shelter.id)}
                isSelected={selectedShelterId === shelter.id}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}