'use client';
import { useState } from 'react';
import SupporterLayout from '@/components/SupporterLayout'; // 支援者用Layoutコンポーネントをインポート

// ===== 型定義 =====
interface Shelter {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  evacueeCount?: number;
  urgentNeeds?: string[];
  lastUpdated?: string;
}
interface SupportStats {
  ongoing: number;
  completed: number;
  totalAmount: string;
}
interface ActiveSupport {
  supportedShelterName: string;
  itemName: string;
  status: 'purchased' | 'delivery_drone' | 'delivered' | 'received';
}
interface Notification {
  message: string;
  time: string;
  color: string;
}

// ===== ページ内UIコンポーネント =====
const StatCard = ({ title, value, icon, bgColor, textColor }: { title: string; value: string | number; icon: string; bgColor: string; textColor: string; }) => (
  <div className={`p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${bgColor}`}>
    <div className="flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor} mb-1`}>{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const ShelterCard = ({ shelter, onSelect, isSelected }: { shelter: Shelter; onSelect: () => void; isSelected: boolean; }) => (
  <div onClick={onSelect} className={`rounded-xl shadow-sm border overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105 flex flex-col ${isSelected ? 'ring-4 ring-blue-400 border-blue-300 shadow-lg' : 'hover:shadow-lg border-gray-200'}`}>
    <div className="relative">
      <img src={shelter.imageUrl} alt={shelter.name} className="w-full h-40 object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E避難所画像%3C/text%3E%3C/svg%3E"; }} />
      {shelter.evacueeCount && (<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1"><span className="text-xs font-semibold text-gray-700">👥 {shelter.evacueeCount}人</span></div>)}
    </div>
    <div className="p-4 bg-white flex flex-col flex-grow">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{shelter.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{shelter.address}</p>
      {shelter.urgentNeeds && (<div className="mb-3"><p className="text-xs font-medium text-red-600 mb-1">緊急に必要:</p><div className="flex flex-wrap gap-1">{shelter.urgentNeeds.slice(0, 2).map((need, index) => (<span key={index} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{need}</span>))}</div></div>)}
      {shelter.lastUpdated && (<p className="text-xs text-gray-500">📅 更新: {shelter.lastUpdated}</p>)}
      <div className="mt-4 pt-3 border-t border-gray-100"><button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">支援内容を確認</button></div>
    </div>
  </div>
);

const ProgressStep = ({ icon, label, isActive, isCompleted }: { icon: string; label: string; isActive: boolean; isCompleted: boolean; }) => (
  <div className={`text-center ${isActive ? 'opacity-100 scale-110' : isCompleted ? 'opacity-100' : 'opacity-40'} transition-all duration-300`}>
    <div className={`text-2xl mb-2 ${isActive ? 'animate-pulse' : ''}`}>{icon}</div>
    <p className={`text-xs font-medium ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{label}</p>
  </div>
);

// ===== メインコンポーネント =====
export default function SupporterHomePage() {
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);

  // 跳转到物资页面的函数
  const handleViewSupplies = () => {
    if (selectedShelterId) {
      // 获取当前URL中的supporter ID
      const currentPath = window.location.pathname;
      const supporterId = currentPath.split('/')[2]; // /supporter/[id]/home -> [id]
      // 跳转到特定避难所的物资页面
      window.location.href = `/supporter/${supporterId}/${selectedShelterId}/supplies`;
    }
  };

  const sheltersList: Shelter[] = [
    { id: 1, name: '中区役所避難所', address: '愛知県名古屋市中区栄四丁目1番8号', imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=160&fit=crop', evacueeCount: 95, urgentNeeds: ['飲料水', '医薬品'], lastUpdated: '2時間前' },
    { id: 2, name: '中村スポーツセンター', address: '愛知県名古屋市中村区中村町字待屋43番地の1', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=160&fit=crop', evacueeCount: 150, urgentNeeds: ['食料品', '毛布'], lastUpdated: '30分前' },
    { id: 3, name: '東生涯学習センター', address: '愛知県名古屋市東区葵一丁目3番21号', imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=160&fit=crop', evacueeCount: 78, urgentNeeds: ['衛生用品'], lastUpdated: '1時間前' },
  ];
  const activeSupport: ActiveSupport = { supportedShelterName: '中村スポーツセンター', itemName: '医薬品セット', status: 'delivery_drone' };
  const recentNotifications: Notification[] = [{ message: '中村スポーツセンターから感謝の通知が届きました', time: '1日前', color: 'bg-green-500' }];
  const stats: SupportStats = { ongoing: 1, completed: 4, totalAmount: '¥18,200' };
  const getProgressSteps = (status: string) => {
    return [
      { icon: '✅', label: '購入完了', isCompleted: true, isActive: status === 'purchased' },
      { icon: '🚚', label: '配送中', isCompleted: ['delivery_drone', 'delivered', 'received'].includes(status), isActive: status === 'delivery_drone' },
      { icon: '📦', label: '避難所到着', isCompleted: ['delivered', 'received'].includes(status), isActive: status === 'delivered' },
      { icon: '🙌', label: '受取完了', isCompleted: status === 'received', isActive: status === 'received' }
    ];
  };

  return (
    <SupporterLayout>
      <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">支援者ポータル</h1>
                <p className="text-gray-600 text-lg">あなたの支援活動状況の確認や、新たな支援先の検索ができます。</p>
              </div>
              <div className="text-6xl"></div>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">📊 あなたの支援サマリー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="進行中の支援" value={stats.ongoing} icon="🚚" bgColor="bg-blue-50 border-blue-200" textColor="text-blue-700" />
              <StatCard title="完了した支援" value={stats.completed} icon="✅" bgColor="bg-green-50 border-green-200" textColor="text-green-700" />
              <StatCard title="支援総額（目安）" value={stats.totalAmount} icon="💰" bgColor="bg-yellow-50 border-yellow-200" textColor="text-yellow-700" />
              <StatCard title="未読の通知" value={recentNotifications.length} icon="💌" bgColor="bg-purple-50 border-purple-200" textColor="text-purple-700" />
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">🔄 進行中の支援状況</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-lg mb-2">現在、<span className="font-bold text-blue-800">{activeSupport.supportedShelterName}</span>へ <span className="font-bold text-blue-800">{activeSupport.itemName}</span>を支援中です。</p>
              <p className="text-sm text-blue-600">配送状況をリアルタイムで追跡できます</p>
            </div>
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {getProgressSteps(activeSupport.status).map((step, index) => (
                <ProgressStep key={index} icon={step.icon} label={step.label} isActive={step.isActive} isCompleted={step.isCompleted} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">🏢 新たな支援先を探す</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sheltersList.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} onSelect={() => setSelectedShelterId(shelter.id)} isSelected={selectedShelterId === shelter.id} />
              ))}
            </div>
            {selectedShelterId && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <p className="text-blue-800 font-medium">📋 選択された避難所: <span className="font-bold">{sheltersList.find(s => s.id === selectedShelterId)?.name}</span></p>
                <button 
                  onClick={handleViewSupplies}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  この避難所の支援リストを見る →
                </button>
              </div>
            )}
          </section>

          {recentNotifications.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">🔔 最近の通知</h2>
              <div className="space-y-4">
                {recentNotifications.map((notification, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </SupporterLayout>
  );
}