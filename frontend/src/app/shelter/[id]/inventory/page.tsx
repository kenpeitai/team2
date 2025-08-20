'use client';

import { useState, useEffect } from 'react';

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  img: string;
};

// デフォルトアイテム
const defaultItems: Item[] = [
  // === 食料・水 ===
  { id: "p-water-2l",     name: "飲料水 2L×6本（1ケース）",  quantity: 0, unit: "ケース", category: "食料・水", img: "/products/p-water-2l.png" },
  { id: "p-instant-rice", name: "サトウのごはん 200g×5食",    quantity: 0, unit: "箱",   category: "食料・水", img: "/products/p-instant-rice.png" },
  { id: "p-canned-food",  name: "缶詰(主食) 1缶",             quantity: 0, unit: "缶",   category: "食料・水", img: "/products/p-canned-food.png" },

  // === 生活用品・衛生 ===
  { id: "p-blanket",      name: "毛布",                       quantity: 0, unit: "枚",   category: "生活用品", img: "/products/p-blanket.png" },
  { id: "p-battery-aa",   name: "単3電池(8本)",               quantity: 0, unit: "パック", category: "生活用品", img: "/products/p-battery-aa.png" },
  { id: "p-mask",         name: "不織布マスク(50枚)",         quantity: 0, unit: "箱",   category: "衛生", img: "/products/p-mask.png" },

  // === 医薬品 ===
  { id: "m-acetaminophen", name: "解熱鎮痛剤（アセトアミノフェン）20錠", quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-acetaminophen.png" },
  { id: "m-ibuprofen",     name: "解熱鎮痛剤（イブプロフェン）24錠",   quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-ibuprofen.png" },
  { id: "m-cold-combo",    name: "総合感冒薬（風邪薬）30錠",          quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-cold-combo.png" },
  { id: "m-antihistamine", name: "抗ヒスタミン薬（アレルギー薬）10錠", quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-antihistamine.png" },
  { id: "m-anti-diarrhea", name: "下痢止め（ロペラミド等）12錠",       quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-anti-diarrhea.png" },
  { id: "m-ors-500",       name: "経口補水液 500mL（1本）",             quantity: 0, unit: "本", category: "医薬品", img: "/products/m-ors-500.png" },
  { id: "m-povidone",      name: "消毒液（ポビドンヨード）100mL",      quantity: 0, unit: "本", category: "医薬品", img: "/products/m-povidone.png" },
  { id: "m-sterile-gauze", name: "滅菌ガーゼ 10枚入",                   quantity: 0, unit: "袋", category: "医薬品", img: "/products/m-sterile-gauze.png" },
  { id: "m-bandage-roll",  name: "包帯 5cm×5m",                         quantity: 0, unit: "巻", category: "医薬品", img: "/products/m-bandage-roll.png" },
  { id: "m-surgical-tape", name: "サージカルテープ 12mm×9m",            quantity: 0, unit: "巻", category: "医薬品", img: "/products/m-surgical-tape.png" },
  { id: "m-bandaids",      name: "ばんそうこう（アソート20枚）",         quantity: 0, unit: "箱", category: "医薬品", img: "/products/m-bandaids.png" },
  { id: "m-thermometer",   name: "体温計",                               quantity: 0, unit: "本", category: "医薬品", img: "/products/m-thermometer.png" },
  { id: "m-eyedrops",      name: "目薬（人工涙液）",                      quantity: 0, unit: "本", category: "医薬品", img: "/products/m-eyedrops.png" },
  { id: "m-cough-syrup",   name: "咳止めシロップ 120mL",                  quantity: 0, unit: "本", category: "医薬品", img: "/products/m-cough-syrup.png" },
  { id: "m-throat-candy",  name: "のど飴",                               quantity: 0, unit: "袋", category: "医薬品", img: "/products/m-throat-candy.png" },
];

export default function InventoryPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(defaultItems);
    }
  }, []);

  if (!items) return <p style={{ padding: '20px' }}>Loading...</p>;

  const changeQuantity = (index: number, delta: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, newItems[index].quantity + delta);
    setItems(newItems);
  };

  const onInputChange = (index: number, value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return;
    const newItems = [...items];
    newItems[index].quantity = num;
    setItems(newItems);
  };

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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
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
          <option value="食料・水">食料・水</option>
          <option value="生活用品">生活用品</option>
          <option value="衛生">衛生</option>
          <option value="医薬品">医薬品</option>
        </select>
      </div>

      {/* アイテム表示 */}
      {filteredItems.length === 0 ? (
        <p>該当する在庫がありません</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '15px' ,paddingBottom: '80px'}}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9',
                textAlign: 'center',
              }}
            >
              <img
                src={item.img}
                alt={item.name}
                style={{ width: '100px', margin: '0 auto 10px auto', display: 'block' }}
              />
              <h3 style={{ marginBottom: '10px' }}>{item.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => changeQuantity(index, 1)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  +
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onInputChange(index, e.target.value)}
                  style={{ width: '50px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <span style={{ marginLeft: '5px' }}>{item.unit}</span>
                <button
                  onClick={() => changeQuantity(index, -1)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        backgroundColor: '#fff',
        borderTop: '1px solid #ccc',
        padding: '10px 0',
        textAlign: 'center',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
       }}>
        <button
          onClick={saveItems}
          style={{
            padding: '10px 20px',
            background: 'firebrick',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          保存
        </button>
      </div>
    </div>
  );
}
