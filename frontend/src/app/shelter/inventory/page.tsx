'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

type Item = {
  name: string;
  quantity: number;
  category: string;
};

// デフォルトアイテム
const defaultItems: Item[] = [
  { name: '水', quantity: 0, category: '水・飲料' },
  { name: '緑茶', quantity: 0, category: '水・飲料' },
  { name: '麦茶', quantity: 0, category: '水・飲料' },
  { name: 'アクエリアス', quantity: 0, category: '水・飲料' },
  { name: 'ポカリスエット', quantity: 0, category: '水・飲料' },
  { name: '牛乳', quantity: 0, category: '水・飲料' },
  { name: '紅茶', quantity: 0, category: '水・飲料' },
  { name: 'コーヒー', quantity: 0, category: '水・飲料' },
  { name: 'スポーツドリンク', quantity: 0, category: '水・飲料' },
  { name: 'ジュース', quantity: 0, category: '水・飲料' },
  { name: 'カップラーメン', quantity: 0, category: '食料' },
  { name: '乾パン', quantity: 0, category: '食料' },
  { name: 'おにぎり', quantity: 0, category: '食料' },
  { name: '缶詰（魚）', quantity: 0, category: '食料' },
  { name: '缶詰（肉）', quantity: 0, category: '食料' },
  { name: '包帯', quantity: 0, category: '医療・衛生' },
  { name: '消毒液', quantity: 0, category: '医療・衛生' },
  { name: '絆創膏', quantity: 0, category: '医療・衛生' },
  { name: 'マスク', quantity: 0, category: '医療・衛生' },
  { name: '毛布', quantity: 0, category: '衣類・寝具' },
  { name: '防寒着', quantity: 0, category: '衣類・寝具' },
  { name: 'レインコート', quantity: 0, category: '衣類・寝具' },
  { name: '懐中電灯', quantity: 0, category: '避難用品' },
  { name: '電池', quantity: 0, category: '避難用品' },
  { name: 'ラジオ', quantity: 0, category: '避難用品' },
  { name: '鍋', quantity: 0, category: '調理器具・食器' },
  { name: 'フライパン', quantity: 0, category: '調理器具・食器' },
  { name: 'お皿', quantity: 0, category: '調理器具・食器' },
  { name: '軍手', quantity: 0, category: '便利品' },
  { name: 'カッターナイフ', quantity: 0, category: '便利品' },
  { name: 'メモ帳', quantity: 0, category: '便利品' },
  { name: 'ペン', quantity: 0, category: '便利品' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // 初期ロード
  useEffect(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(defaultItems);
    }
  }, []);

  if (!items) return <p style={{ padding: '20px' }}>Loading...</p>;

  // 数量を変更（＋ー）
  const changeQuantity = (index: number, delta: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, newItems[index].quantity + delta);
    setItems(newItems);
  };

  // 数値入力で直接変更
  const onInputChange = (index: number, value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return;
    const newItems = [...items];
    newItems[index].quantity = num;
    setItems(newItems);
  };

  // 保存ボタン
  const saveItems = () => {
    localStorage.setItem('inventory', JSON.stringify(items));
    alert('保存しました！');
  };

  const filteredItems = items.filter(
    (item) =>
      (filter === 'all' || item.category === filter) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        在庫管理
      </h1>

      {/* 検索＆カテゴリ選択 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="名前やカテゴリで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', flex: '1', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="all">すべて</option>
          <option value="水・飲料">水・飲料</option>
          <option value="食料">食料</option>
          <option value="医療・衛生">医療・衛生</option>
          <option value="衣類・寝具">衣類・寝具</option>
          <option value="避難用品">避難用品</option>
          <option value="調理器具・食器">調理器具・食器</option>
          <option value="便利品">便利品</option>
        </select>
      </div>

      {/* アイテム表示 */}
      {filteredItems.length === 0 ? (
        <p>該当する在庫がありません</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '15px' }}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ marginBottom: '10px' }}>{item.name}</h3>
              <p>カテゴリー: {item.category}</p>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '10px' }}>
                <button
                  onClick={() => changeQuantity(index, 1)}
                  style={{
                    flex: 1,
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ＋
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onInputChange(index, e.target.value)}
                  style={{ width: '50px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                  onClick={() => changeQuantity(index, -1)}
                  style={{
                    flex: 1,
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  －
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 保存ボタン */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={saveItems}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          保存
        </button>
      </div>
    </div>
    </Layout>
  );
}