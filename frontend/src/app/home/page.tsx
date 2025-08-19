'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState('evacuation');

  const menuItems = [
    {
      id: 'evacuation',
      title: '避難所状況',
      description: '避難所状況の登録・確認',
      icon: '🏠',
      color: 'bg-blue-500',
      href: '/evacuation'
    },
    {
      id: 'supplies',
      title: '必要物資リスト',
      description: '必要物資の登録・確認',
      icon: '📦',
      color: 'bg-green-500',
      href: '/supplies'
    },
    {
      id: 'inventory',
      title: '在庫管理',
      description: '物資の在庫状況管理',
      icon: '📊',
      color: 'bg-orange-500',
      href: '/inventory'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">災害支援システム</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">ようこそ</span>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ダッシュボード概要 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ダッシュボード</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">🏠</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">避難者数</p>
                  <p className="text-2xl font-semibold text-gray-900">125</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">必要物資</p>
                  <p className="text-2xl font-semibold text-gray-900">23</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">在庫アイテム</p>
                  <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メニューカード */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">機能メニュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                      詳細を見る
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近の活動 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">最近の活動</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">新しい避難者が登録されました</p>
                <p className="text-xs text-gray-500">2時間前</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">物資の在庫が更新されました</p>
                <p className="text-xs text-gray-500">4時間前</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">必要物資リストが更新されました</p>
                <p className="text-xs text-gray-500">6時間前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


