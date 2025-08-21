'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useParams, useRouter } from 'next/navigation';
import type { InventoryDto } from '@/types/api';
import { getInventoryByShelter, updateInventoryQuantity, addInventoryItem } from '@/lib/api';

// rakutenカラー
const RAKUTEN_RED = '#BF0000';
const RAKUTEN_RED_HOVER = '#990000';

type Item = InventoryDto;

// カタログ（画像・単位付き）
type CatalogItem = {
  code: string;
  name: string;
  unit: string;
  category: '食料・水' | '生活用品' | '衛生' | '医薬品';
  img: string;
};

const catalogItems: CatalogItem[] = [
  { code: 'p-water-2l',     name: '飲料水 2L×6本（1ケース）', unit: 'ケース', category: '食料・水', img: '/products/p-water-2l.png' },
  { code: 'p-instant-rice', name: 'サトウのごはん 200g×5食',   unit: '箱',   category: '食料・水', img: '/products/p-instant-rice.png' },
  { code: 'p-canned-food',  name: '缶詰(主食) 1缶',            unit: '缶',   category: '食料・水', img: '/products/p-canned-food.png' },
  { code: 'p-blanket',      name: '毛布',                      unit: '枚',   category: '生活用品', img: '/products/p-blanket.png' },
  { code: 'p-battery-aa',   name: '単3電池(8本)',              unit: 'パック', category: '生活用品', img: '/products/p-battery-aa.png' },
  { code: 'p-mask',         name: '不織布マスク(50枚)',        unit: '箱',   category: '衛生', img: '/products/p-mask.png' },
  { code: 'm-acetaminophen', name: '解熱鎮痛剤（アセトアミノフェン）20錠', unit: '箱', category: '医薬品', img: '/products/m-acetaminophen.png' },
  { code: 'm-ibuprofen',     name: '解熱鎮痛剤（イブプロフェン）24錠',   unit: '箱', category: '医薬品', img: '/products/m-ibuprofen.png' },
  { code: 'm-cold-combo',    name: '総合感冒薬（風邪薬）30錠',         unit: '箱', category: '医薬品', img: '/products/m-cold-combo.png' },
  { code: 'm-antihistamine', name: '抗ヒスタミン薬（アレルギー薬）10錠', unit: '箱', category: '医薬品', img: '/products/m-antihistamine.png' },
  { code: 'm-anti-diarrhea', name: '下痢止め（ロペラミド等）12錠',      unit: '箱', category: '医薬品', img: '/products/m-anti-diarrhea.png' },
  { code: 'm-ors-500',       name: '経口補水液 500mL（1本）',            unit: '本', category: '医薬品', img: '/products/m-ors-500.png' },
  { code: 'm-povidone',      name: '消毒液（ポビドンヨード）100mL',     unit: '本', category: '医薬品', img: '/products/m-povidone.png' },
  { code: 'm-sterile-gauze', name: '滅菌ガーゼ 10枚入',                  unit: '袋', category: '医薬品', img: '/products/m-sterile-gauze.png' },
  { code: 'm-bandage-roll',  name: '包帯 5cm×5m',                        unit: '巻', category: '医薬品', img: '/products/m-bandage-roll.png' },
  { code: 'm-surgical-tape', name: 'サージカルテープ 12mm×9m',           unit: '巻', category: '医薬品', img: '/products/m-surgical-tape.png' },
  { code: 'm-bandaids',      name: 'ばんそうこう（アソート20枚）',        unit: '箱', category: '医薬品', img: '/products/m-bandaids.png' },
  { code: 'm-thermometer',   name: '体温計',                              unit: '本', category: '医薬品', img: '/products/m-thermometer.png' },
  { code: 'm-eyedrops',      name: '目薬（人工涙液）',                     unit: '本', category: '医薬品', img: '/products/m-eyedrops.png' },
  { code: 'm-cough-syrup',   name: '咳止めシロップ 120mL',                 unit: '本', category: '医薬品', img: '/products/m-cough-syrup.png' },
  { code: 'm-throat-candy',  name: 'のど飴',                              unit: '袋', category: '医薬品', img: '/products/m-throat-candy.png' },
];

export default function InventoryPage() {
  const params = useParams<{ id: string }>();
  const shelterId = Number(params?.id);
  const router = useRouter();

  const [items, setItems] = useState<Item[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | '食料・水' | '生活用品' | '衛生' | '医薬品'>('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'食料・水' | '生活用品' | '衛生' | '医薬品'>('食料・水');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [selectedCode, setSelectedCode] = useState<string>('');

  const selectedCatalog = useMemo(() => catalogItems.find((c) => c.code === selectedCode), [selectedCode]);
  useEffect(() => {
    if (selectedCatalog) {
      setNewName(selectedCatalog.name);
      setNewCategory(selectedCatalog.category);
    }
  }, [selectedCatalog]);

  // 全角数字を半角に正規化
  const toHalfWidthNumeric = (s: string) =>
    s
      .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xFEE0))
      .replace(/．/g, '.')
      .replace(/－/g, '-');

  // 初期ロード
  useEffect(() => {
    if (!Number.isFinite(shelterId)) return;
    let active = true;
    setLoading(true);
    setError(null);
    getInventoryByShelter(shelterId)
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? '在庫の取得に失敗しました');
        setItems([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shelterId]);

  // 合計
  const totalUnits = useMemo(
    () => (items ?? []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0),
    [items]
  );

  const onInputChange = (id: number | undefined, value: string) => {
    const normalized = toHalfWidthNumeric(value).trim();
    const num = normalized === '' ? 0 : Number(normalized);
    if (!Number.isFinite(num) || num < 0 || !id) return;
    setItems((prev) => (prev ? prev.map((it) => (it.id === id ? { ...it, quantity: num } : it)) : prev));
  };

  const saveItems = async () => {
    if (!items) return;
    try {
      setSaving(true);
      await Promise.all(
        items
          .filter((it) => typeof it.id === 'number')
          .map((it) => updateInventoryQuantity(it.id as number, it as InventoryDto))
      );
      if (Number.isFinite(shelterId)) {
        router.push(`/shelter/${shelterId}/home`);
      }
    } catch (e: any) {
      alert(e?.message ?? '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = (items ?? []).filter((item) => {
    const hitFilter = filter === 'all' || item.category === filter;
    const q = search.trim().toLowerCase();
    const hay = `${item.name} ${item.category} ${item.id}`.toLowerCase();
    return hitFilter && (q === '' || hay.includes(q));
  });

  const onAddItem = async () => {
    if (!Number.isFinite(shelterId)) return;
    const name = newName.trim();
    const quantity = Number(newQuantity);
    if (!name) {
      alert('名前を入力してください');
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
      alert('数量は0以上の数値で入力してください');
      return;
    }
    if (!selectedCatalog) {
      alert('カタログから商品を選択してください');
      return;
    }
    try {
      setAdding(true);
      // 既存チェック（同名）: あれば数量を加算更新、なければ新規作成
      const existing = (items ?? []).find((it) => it.name === name);
      if (existing && typeof existing.id === 'number') {
        const updated = await updateInventoryQuantity(existing.id, {
          ...existing,
          quantity: (existing.quantity ?? 0) + quantity,
        });
        setItems((prev) => prev ? prev.map(it => it.id === existing.id ? updated : it) : [updated]);
      } else {
        const created = await addInventoryItem({
          shelterId,
          name,
          category: selectedCatalog.category,
          quantity,
        });
        setItems((prev) => ([...(prev ?? []), created]));
      }
      setNewName('');
      setNewCategory('食料・水');
      setNewQuantity(0);
      setSelectedCode('');
      alert('在庫を追加しました');
    } catch (e: any) {
      alert(e?.message ?? '在庫の追加に失敗しました');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white overflow-x-hidden pb-24">
        {/* ヘッダ */}
        <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">在庫管理</h1>

          {/* 検索＆カテゴリ選択 */}
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="名前・カテゴリ・IDで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border px-3 py-3 sm:col-span-2"
              disabled={loading}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-xl border px-3 py-3"
              disabled={loading}
            >
              <option value="all">すべて</option>
              <option value="食料・水">食料・水</option>
              <option value="生活用品">生活用品</option>
              <option value="衛生">衛生</option>
              <option value="医薬品">医薬品</option>
            </select>
          </div>
          {/* 追加フォーム（カタログから選択） */}
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <label htmlFor="new-product" className="block text-sm text-gray-600 mb-1">カタログから選択</label>
              <select
                id="new-product"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-full rounded-xl border px-3 py-3"
                disabled={loading || adding}
              >
                <option value="">選択してください</option>
                <optgroup label="食料・水">
                  {catalogItems.filter(c=>c.category==='食料・水').map(c=> (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="生活用品">
                  {catalogItems.filter(c=>c.category==='生活用品').map(c=> (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="衛生">
                  {catalogItems.filter(c=>c.category==='衛生').map(c=> (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="医薬品">
                  {catalogItems.filter(c=>c.category==='医薬品').map(c=> (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <div className="block text-sm text-gray-600 mb-1">カテゴリ</div>
              <div className="px-3 py-3 rounded-xl border bg-gray-50 text-gray-700">
                {selectedCatalog?.category ?? newCategory}
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="new-quantity" className="block text-sm text-gray-600 mb-1">数量</label>
              <input
                id="new-quantity"
                type="number"
                min={0}
                step={1}
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="w-full rounded-xl border px-3 py-3 text-right"
                disabled={loading || adding}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={onAddItem}
                className="w-full rounded-xl px-5 py-3 text-white whitespace-nowrap disabled:opacity-60 hover:brightness-90 focus:brightness-90"
                style={{ backgroundColor: RAKUTEN_RED }}
                disabled={adding || loading}
              >
                {adding ? '追加中...' : '在庫を追加'}
              </button>
            </div>
            {selectedCatalog && (
              <div className="sm:col-span-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-20 bg-gray-50 rounded-lg overflow-hidden">
                    <Image src={selectedCatalog.img} alt={selectedCatalog.name} fill className="object-contain" sizes="112px" />
                  </div>
                  <div className="text-sm text-gray-600">単位: {selectedCatalog.unit}</div>
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        {/* リスト */}
        <section className="mx-auto max-w-screen-xl px-4 pb-8">
          {loading && <p>Loading...</p>}
          {!loading && filteredItems.length === 0 && (
            <p className="text-gray-600">該当する在庫がありません</p>
          )}
          {!loading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  {/* 画像 */}
                  {(() => {
                    const cat = catalogItems.find(c => c.name === item.name);
                    return (
                      <div className="relative w-full h-56 sm:h-64 lg:h-72 rounded-t-3xl overflow-hidden bg-gray-50">
                        {cat && (
                          <Image
                            src={cat.img}
                            alt={item.name}
                            fill
                            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                            className="object-contain"
                            priority
                          />
                        )}
                      </div>
                    );
                  })()}

                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                    <div className="text-sm text-gray-500">{item.category}</div>

                    <div>
                      <label htmlFor={`qty-${item.id}`} className="block text-sm text-gray-600 mb-1">数量</label>
                      <div className="flex items-center gap-2">
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min={0}
                          step={1}
                          className="w-28 rounded-xl border px-3 py-3 text-right"
                          value={item.quantity}
                          onChange={(e) => onInputChange(item.id, e.target.value)}
                          aria-label="数量"
                          disabled={saving}
                        />
                        {(() => {
                          const cat = catalogItems.find(c => c.name === item.name);
                          return (
                            <span className="text-sm text-gray-500 whitespace-nowrap">{cat?.unit}</span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 固定フッター */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur border-t">
          <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-700 whitespace-nowrap">
              総在庫数 <b>{totalUnits}</b>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveItems}
                className="rounded-xl px-5 py-2.5 text-white whitespace-nowrap disabled:opacity-60 hover:brightness-90 focus:brightness-90"
                style={{ backgroundColor: RAKUTEN_RED }}
                disabled={saving || loading}
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
