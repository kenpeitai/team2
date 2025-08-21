'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';

// rakutenカラー
const RAKUTEN_RED = '#BF0000';
const RAKUTEN_RED_HOVER = '#990000';

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  img: string; // /products/{id}.png を想定
};

// デフォルトアイテム
const defaultItems: Item[] = [
  // === 食料・水 ===
  { id: 'p-water-2l',     name: '飲料水 2L×6本（1ケース）',  quantity: 0, unit: 'ケース', category: '食料・水', img: '/products/p-water-2l.png' },
  { id: 'p-instant-rice', name: 'サトウのごはん 200g×5食',    quantity: 0, unit: '箱',   category: '食料・水', img: '/products/p-instant-rice.png' },
  { id: 'p-canned-food',  name: '缶詰(主食) 1缶',             quantity: 0, unit: '缶',   category: '食料・水', img: '/products/p-canned-food.png' },

  // === 生活用品・衛生 ===
  { id: 'p-blanket',      name: '毛布',                       quantity: 0, unit: '枚',   category: '生活用品', img: '/products/p-blanket.png' },
  { id: 'p-battery-aa',   name: '単3電池(8本)',               quantity: 0, unit: 'パック', category: '生活用品', img: '/products/p-battery-aa.png' },
  { id: 'p-mask',         name: '不織布マスク(50枚)',         quantity: 0, unit: '箱',   category: '衛生', img: '/products/p-mask.png' },

  // === 医薬品 ===
  { id: 'm-acetaminophen', name: '解熱鎮痛剤（アセトアミノフェン）20錠', quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-acetaminophen.png' },
  { id: 'm-ibuprofen',     name: '解熱鎮痛剤（イブプロフェン）24錠',   quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-ibuprofen.png' },
  { id: 'm-cold-combo',    name: '総合感冒薬（風邪薬）30錠',          quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-cold-combo.png' },
  { id: 'm-antihistamine', name: '抗ヒスタミン薬（アレルギー薬）10錠', quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-antihistamine.png' },
  { id: 'm-anti-diarrhea', name: '下痢止め（ロペラミド等）12錠',       quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-anti-diarrhea.png' },
  { id: 'm-ors-500',       name: '経口補水液 500mL（1本）',             quantity: 0, unit: '本', category: '医薬品', img: '/products/m-ors-500.png' },
  { id: 'm-povidone',      name: '消毒液（ポビドンヨード）100mL',      quantity: 0, unit: '本', category: '医薬品', img: '/products/m-povidone.png' },
  { id: 'm-sterile-gauze', name: '滅菌ガーゼ 10枚入',                   quantity: 0, unit: '袋', category: '医薬品', img: '/products/m-sterile-gauze.png' },
  { id: 'm-bandage-roll',  name: '包帯 5cm×5m',                         quantity: 0, unit: '巻', category: '医薬品', img: '/products/m-bandage-roll.png' },
  { id: 'm-surgical-tape', name: 'サージカルテープ 12mm×9m',            quantity: 0, unit: '巻', category: '医薬品', img: '/products/m-surgical-tape.png' },
  { id: 'm-bandaids',      name: 'ばんそうこう（アソート20枚）',         quantity: 0, unit: '箱', category: '医薬品', img: '/products/m-bandaids.png' },
  { id: 'm-thermometer',   name: '体温計',                               quantity: 0, unit: '本', category: '医薬品', img: '/products/m-thermometer.png' },
  { id: 'm-eyedrops',      name: '目薬（人工涙液）',                      quantity: 0, unit: '本', category: '医薬品', img: '/products/m-eyedrops.png' },
  { id: 'm-cough-syrup',   name: '咳止めシロップ 120mL',                  quantity: 0, unit: '本', category: '医薬品', img: '/products/m-cough-syrup.png' },
  { id: 'm-throat-candy',  name: 'のど飴',                               quantity: 0, unit: '袋', category: '医薬品', img: '/products/m-throat-candy.png' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | '食料・水' | '生活用品' | '衛生' | '医薬品'>('all');

  // 初期ロード
  useEffect(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems(defaultItems);
      }
    } else {
      setItems(defaultItems);
    }
  }, []);

  // 合計
  const totalUnits = useMemo(
    () => (items ?? []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0),
    [items]
  );

  if (!items) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const onInputChange = (id: string, value: string) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) return;
    setItems((prev) => (prev ? prev.map((it) => (it.id === id ? { ...it, quantity: num } : it)) : prev));
  };

  const saveItems = () => {
    localStorage.setItem('inventory', JSON.stringify(items));
    alert('保存しました！');
  };

  const filteredItems = items.filter((item) => {
    const hitFilter = filter === 'all' || item.category === filter;
    const q = search.trim().toLowerCase();
    const hay = `${item.name} ${item.category} ${item.id}`.toLowerCase();
    return hitFilter && (q === '' || hay.includes(q));
  });

  return (
    <Layout>
      <div className="min-h-screen bg-white overflow-x-hidden pb-24">
        {/* ヘッダ */}
        <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">在庫管理</h1>

          {/* 検索＆カテゴリ選択（NeedsListFormテイストに寄せる） */}
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="名前・カテゴリ・IDで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border px-3 py-3 sm:col-span-2"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-xl border px-3 py-3"
            >
              <option value="all">すべて</option>
              <option value="食料・水">食料・水</option>
              <option value="生活用品">生活用品</option>
              <option value="衛生">衛生</option>
              <option value="医薬品">医薬品</option>
            </select>
          </div>
        </div>

        {/* カードグリッド */}
        <section className="mx-auto max-w-screen-xl px-4 pb-8">
          {filteredItems.length === 0 ? (
            <p className="text-gray-600">該当する在庫がありません</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  {/* 画像（NeedsListFormと同じヒーロー配置） */}
                  <div className="relative w-full h-56 sm:h-64 lg:h-72 rounded-t-3xl overflow-hidden bg-gray-50">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* 本体 */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                    <div className="text-sm text-gray-500">{item.category}</div>

                    {/* 数量（NeedsListFormの“数量行”レイアウトに合わせる。プラマイ無し） */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">数量</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className="w-28 rounded-xl border px-3 py-3 text-right"
                          value={item.quantity}
                          onChange={(e) => onInputChange(item.id, e.target.value)}
                          aria-label="数量"
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">{item.unit}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 固定フッター（NeedsListFormのバーを踏襲） */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur border-t">
          <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-700 whitespace-nowrap">
              総在庫数 <b>{totalUnits}</b>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveItems}
                className="rounded-xl px-5 py-2.5 text-white whitespace-nowrap"
                style={{ backgroundColor: RAKUTEN_RED }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED_HOVER)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = RAKUTEN_RED)}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
