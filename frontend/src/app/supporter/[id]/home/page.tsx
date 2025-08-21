'use client';
import { useState, useEffect } from 'react';
import SupporterLayout from '@/components/SupporterLayout';

// ===== 型定義 =====
// APIから返ってくる生の避難所データ
interface ShelterFromApi {
  id: number;
  shelterName: string;
  shelterAddress: string;
  evacueeCount?: number;
}
// ページ表示用の型
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

// ===== APIクライアント関数 (本来は別ファイルに記述) =====
async function getShelters(): Promise<ShelterFromApi[]> {
  const response = await fetch('http://localhost:8080/api/shelters');
  if (!response.ok) throw new Error('避難所情報の取得に失敗しました。');
  return response.json();
}
async function getSupporterData(supporterId: string) {
    console.log(`Fetching data for supporter ${supporterId}...`);
    return {
        stats: { ongoing: 1, completed: 4, totalAmount: '¥18,200' },
        activeSupport: { supportedShelterName: '中央避難所', itemName: '医薬品セット', status: 'delivery_drone' },
        notifications: [{ message: '中央避難所から感謝の通知が届きました', time: '1日前', color: 'bg-green-500' }]
    };
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

const ShelterCard = ({ shelter, onSupportClick }: { shelter: Shelter; onSupportClick: () => void; }) => (
  <div className="rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col bg-white">
    <div className="relative">
      <img src={shelter.imageUrl} alt={shelter.name} className="w-full h-40 object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E避難所画像%3C/text%3E%3C/svg%3E"; }} />
      {shelter.evacueeCount && (<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1"><span className="text-xs font-semibold text-gray-700">👥 {shelter.evacueeCount}人</span></div>)}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{shelter.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{shelter.address}</p>
      {shelter.urgentNeeds && (<div className="mb-3"><p className="text-xs font-medium text-red-600 mb-1">緊急に必要:</p><div className="flex flex-wrap gap-1">{shelter.urgentNeeds.slice(0, 2).map((need, index) => (<span key={index} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{need}</span>))}</div></div>)}
      {shelter.lastUpdated && (<p className="text-xs text-gray-500">📅 更新: {shelter.lastUpdated}</p>)}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button 
          onClick={onSupportClick}
          // ★ 修正点: ボタンのクラスを楽天カラーに変更
          className="btn btn-primary w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          支援する
        </button>
      </div>
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
  const [sheltersList, setSheltersList] = useState<Shelter[]>([]);
  const [stats, setStats] = useState<SupportStats>({ ongoing: 0, completed: 0, totalAmount: '¥0' });
  const [activeSupport, setActiveSupport] = useState<ActiveSupport | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supporterId = window.location.pathname.split('/')[2];
        if (!supporterId) throw new Error("支援者IDがURLから取得できません。");

        const apiShelters = await getShelters();
        const formattedShelters = apiShelters.map((shelter, index) => ({
          id: shelter.id,
          name: shelter.shelterName,
          address: shelter.shelterAddress,
          evacueeCount: shelter.evacueeCount,
          imageUrl: `https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=160&fit=crop&q=80&${index}`,
          urgentNeeds: ['衛生用品', '毛布'],
          lastUpdated: '1時間前'
        }));
        setSheltersList(formattedShelters);

        const supporterData = await getSupporterData(supporterId);
        setStats(supporterData.stats);
        // 型安全にstatusを変換
        const validStatuses = ['purchased', 'delivery_drone', 'delivered', 'received'] as const;
        const activeSupport = supporterData.activeSupport;
        if (activeSupport && validStatuses.includes(activeSupport.status as typeof validStatuses[number])) {
          setActiveSupport({
            ...activeSupport,
            status: activeSupport.status as 'purchased' | 'delivery_drone' | 'delivered' | 'received'
          });
        } else {
          setActiveSupport(null);
        }
        setRecentNotifications(supporterData.notifications);

      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSupportNavigation = (shelterId: number) => {
    const supporterId = window.location.pathname.split('/')[2];
    if (supporterId && shelterId) {
      window.location.href = `/supporter/${supporterId}/${shelterId}/supplies`;
    }
  };

  const getProgressSteps = (status: string) => {
    return [
      { icon: '✅', label: '購入完了', isCompleted: true, isActive: status === 'purchased' },
      { icon: '🚚', label: '配送中', isCompleted: ['delivery_drone', 'delivered', 'received'].includes(status), isActive: status === 'delivery_drone' },
      { icon: '📦', label: '避難所到着', isCompleted: ['delivered', 'received'].includes(status), isActive: status === 'delivered' },
      { icon: '🙌', label: '受取完了', isCompleted: status === 'received', isActive: status === 'received' }
    ];
  };

  if (isLoading) {
    return <SupporterLayout><div className="min-h-screen flex items-center justify-center">読み込み中...</div></SupporterLayout>;
  }

  if (error) {
    return <SupporterLayout><div className="min-h-screen flex items-center justify-center text-red-500">エラー: {error}</div></SupporterLayout>;
  }

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

          {activeSupport && (
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
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">🏢 新たな支援先を探す</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sheltersList.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} onSupportClick={() => handleSupportNavigation(shelter.id)} />
              ))}
            </div>
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