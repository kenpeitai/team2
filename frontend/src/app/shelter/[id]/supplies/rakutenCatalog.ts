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

  // === 生活用品・衛生 ===
  {
    id: "p-blanket",
    name: "毛布",
    searchKeywords: [ "防災 毛布"],
    unit: "枚",
    weightGrams: 800,
    category: "生活用品"
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
    id: "m-ors-500",
    name: "経口補水液 500mL（1本）",
    searchKeywords: ["経口補水液 500mL", "OS-1 500mL", "ポカリスエット"],
    unit: "本",
    weightGrams: 500,
    category: "医薬品",
    recommendedPerPersonPerDay: 0.5
  },
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
