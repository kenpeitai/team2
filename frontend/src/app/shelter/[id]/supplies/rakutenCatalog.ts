import { Category } from "./types";

// 楽天市場で検索する商品の定義
export interface RakutenProductDefinition {
  id: string;
  name: string;
  searchKeywords: string[];  // 楽天市場で検索するキーワード
  unit: string;
  weightGrams: number;
  category: Category;
  recommendedPerPersonPerDay?: number;
  fallbackImage?: string;    // 楽天市場で画像が見つからない場合のフォールバック
}

// 楽天市場商品カタログ
export const RAKUTEN_PRODUCT_CATALOG: RakutenProductDefinition[] = [
  // === 食料・水 ===
  {
    id: "p-water-2l",
    name: "飲料水 2L×6本（1ケース）",
    searchKeywords: ["ミネラルウォーター 2L 6本"],
    unit: "ケース",
    weightGrams: 12000,
    category: "食料"
  },
  {
    id: "p-instant-rice",
    name: "サトウのごはん 200g×5食",
    searchKeywords: ["サトウのごはん 200g", "レトルトごはん 200g", "サトウ ごはん"],
    unit: "箱",
    weightGrams: 1000,
    category: "食料",
    recommendedPerPersonPerDay: 0.2
  },
  {
    id: "p-canned-food",
    name: "缶詰(主食) 1缶",
    searchKeywords: ["非常食 缶パン"],
    unit: "缶",
    weightGrams: 350,
    category: "食料",
    recommendedPerPersonPerDay: 1
  },

  // === 生活用品・衛生 ===
  {
    id: "p-blanket",
    name: "毛布",
    searchKeywords: [ "防災 毛布"],
    unit: "枚",
    weightGrams: 800,
    category: "生活用品"
  },
  {
    id: "p-battery-aa",
    name: "単3電池(8本)",
    searchKeywords: ["乾電池 単3 8本"],
    unit: "パック",
    weightGrams: 180,
    category: "生活用品"
  },
  {
    id: "p-mask",
    name: "不織布マスク(50枚)",
    searchKeywords: ["不織布マスク 50枚", "マスク 50枚",],
    unit: "箱",
    weightGrams: 200,
    category: "衛生",
    recommendedPerPersonPerDay: 0.5
  },

  // === 医薬品 ===
  {
    id: "m-acetaminophen",
    name: "解熱鎮痛剤（アセトアミノフェン）20錠",
    searchKeywords: ["アセトアミノフェン 20錠", "解熱鎮痛剤 アセトアミノフェン", "カロナール"],
    unit: "箱",
    weightGrams: 25,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-ibuprofen",
    name: "解熱鎮痛剤（イブプロフェン）24錠",
    searchKeywords: ["イブプロフェン 24錠", "解熱鎮痛剤 イブプロフェン", "ブルフェン"],
    unit: "箱",
    weightGrams: 28,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-cold-combo",
    name: "総合感冒薬（風邪薬）30錠",
    searchKeywords: ["総合感冒薬 30錠", "風邪薬 30錠", "PL配合顆粒"],
    unit: "箱",
    weightGrams: 40,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-antihistamine",
    name: "抗ヒスタミン薬（アレルギー薬）10錠",
    searchKeywords: ["抗ヒスタミン薬 10錠", "アレルギー薬 10錠", "アレグラ"],
    unit: "箱",
    weightGrams: 20,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.01
  },
  {
    id: "m-anti-diarrhea",
    name: "下痢止め（ロペラミド等）12錠",
    searchKeywords: ["下痢止め 12錠", "ロペラミド", "正露丸"],
    unit: "箱",
    weightGrams: 18,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.01
  },
  {
    id: "m-ors-500",
    name: "経口補水液 500mL（1本）",
    searchKeywords: ["経口補水液 500mL", "OS-1 500mL", "ポカリスエット"],
    unit: "本",
    weightGrams: 500,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.5
  },
  {
    id: "m-povidone",
    name: "消毒液（ポビドンヨード）100mL",
    searchKeywords: ["ポビドンヨード 100mL", "消毒液 100mL", "イソジン"],
    unit: "本",
    weightGrams: 120,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.01
  },
  {
    id: "m-sterile-gauze",
    name: "滅菌ガーゼ 10枚入",
    searchKeywords: ["滅菌ガーゼ 10枚", "ガーゼ 10枚", "滅菌ガーゼ"],
    unit: "袋",
    weightGrams: 50,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-bandage-roll",
    name: "包帯 5cm×5m",
    searchKeywords: ["包帯 5cm 5m", "包帯 5cm", "ガーゼ包帯"],
    unit: "巻",
    weightGrams: 30,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-surgical-tape",
    name: "医療用テープ",
    searchKeywords: [ "医療用テープ"],
    unit: "巻",
    weightGrams: 25,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-bandaids",
    name: "ばんそうこう（アソート20枚）",
    searchKeywords: ["ばんそうこう 20枚", "絆創膏 20枚", "バンドエイド"],
    unit: "箱",
    weightGrams: 80,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-thermometer",
    name: "体温計",
    searchKeywords: ["体温計", "デジタル体温計", "電子体温計"],
    unit: "本",
    weightGrams: 50,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.005
  },
  {
    id: "m-eyedrops",
    name: "目薬（人工涙液）",
    searchKeywords: [ "目薬 人工涙液"],
    unit: "本",
    weightGrams: 20,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.01
  },
  {
    id: "m-cough-syrup",
    name: "咳止めシロップ 120mL",
    searchKeywords: ["咳止めシロップ 120mL"],
    unit: "本",
    weightGrams: 160,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.02
  },
  {
    id: "m-throat-candy",
    name: "のど飴",
    searchKeywords: ["のど飴"],
    unit: "袋",
    weightGrams: 80,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.05
  }
];

// カテゴリ別にグループ化
export function getRakutenProductsByCategory(): Map<Category, RakutenProductDefinition[]> {
  const grouped = new Map<Category, RakutenProductDefinition[]>();
  
  RAKUTEN_PRODUCT_CATALOG.forEach(product => {
    if (!grouped.has(product.category)) {
      grouped.set(product.category, []);
    }
    grouped.get(product.category)!.push(product);
  });
  
  // 各カテゴリ内で名前順にソート
  grouped.forEach(products => {
    products.sort((a, b) => a.name.localeCompare(b.name, "ja"));
  });
  
  return grouped;
}

// 商品IDから商品定義を取得
export function getRakutenProductById(id: string): RakutenProductDefinition | undefined {
  return RAKUTEN_PRODUCT_CATALOG.find(product => product.id === id);
}
