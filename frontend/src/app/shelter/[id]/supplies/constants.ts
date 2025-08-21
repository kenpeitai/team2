import { Product } from "./types";

// ===== Theme =====
export const RAKUTEN_RED = "#BF0000";
export const RAKUTEN_RED_HOVER = "#990000";

// ===== Config =====
export const DRONE_MAX_PAYLOAD_G = 2000;         // 1回あたりの目安
export const WATER_L_PER_PERSON_PER_DAY = 3;     // 水の基準（2〜3L推奨）
export const ML_PER_L = 1000;

// ===== Default Catalog =====
export const DEFAULT_CATALOG: Product[] = [
  // === 食料・水 ===
  { id: "p-water-2l",     name: "飲料水 2L×6本（1ケース）", unit: "ケース", weightGrams: 12000, category: "食料", imageVerified: false },
  { id: "p-instant-rice", name: "サトウのごはん 200g×5食",   unit: "箱",    weightGrams: 1000,  recommendedPerPersonPerDay: 0.2, category: "食料", imageVerified: false },
  { id: "p-canned-food",  name: "缶詰(主食) 1缶",            unit: "缶",    weightGrams: 350,   recommendedPerPersonPerDay: 1,   category: "食料", imageVerified: false },

  // === 生活用品・衛生 ===
  { id: "p-blanket",      name: "毛布",                      unit: "枚",    weightGrams: 800,   category: "生活用品", imageVerified: false },
  { id: "p-battery-aa",   name: "単3電池(8本)",              unit: "パック", weightGrams: 180,  category: "生活用品", imageVerified: false },
  { id: "p-mask",         name: "不織布マスク(50枚)",        unit: "箱",    weightGrams: 200,   recommendedPerPersonPerDay: 0.5, category: "衛生", imageVerified: false },

  // === 医薬品 ===
  { id: "m-acetaminophen", name: "解熱鎮痛剤（アセトアミノフェン）20錠", unit: "箱", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-ibuprofen",     name: "解熱鎮痛剤（イブプロフェン）24錠",     unit: "箱", weightGrams: 28,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-cold-combo",    name: "総合感冒薬（風邪薬）30錠",             unit: "箱", weightGrams: 40,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-antihistamine", name: "抗ヒスタミン薬（アレルギー薬）10錠",   unit: "箱", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-anti-diarrhea", name: "下痢止め（ロペラミド等）12錠",         unit: "箱", weightGrams: 18,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-ors-500",       name: "経口補水液 500mL（1本）",               unit: "本", weightGrams: 500, recommendedPerPersonPerDay: 0.5, category: "医薬品", imageVerified: false },
  { id: "m-povidone",      name: "消毒液（ポビドンヨード）100mL",        unit: "本", weightGrams: 120, recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-sterile-gauze", name: "滅菌ガーゼ 10枚入",                     unit: "袋", weightGrams: 50,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-bandage-roll",  name: "包帯 5cm×5m",                           unit: "巻", weightGrams: 30,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-surgical-tape", name: "サージカルテープ 12mm×9m",              unit: "巻", weightGrams: 25,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-bandaids",      name: "ばんそうこう（アソート20枚）",           unit: "箱", weightGrams: 80,  recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-thermometer",   name: "体温計",                                   unit: "本", weightGrams: 50,  recommendedPerPersonPerDay: 0.005, category: "医薬品", imageVerified: false },
  { id: "m-eyedrops",      name: "目薬（人工涙液）",                        unit: "本", weightGrams: 20,  recommendedPerPersonPerDay: 0.01, category: "医薬品", imageVerified: false },
  { id: "m-cough-syrup",   name: "咳止めシロップ 120mL",                    unit: "本", weightGrams: 160, recommendedPerPersonPerDay: 0.02, category: "医薬品", imageVerified: false },
  { id: "m-throat-candy",  name: "のど飴",                                   unit: "袋", weightGrams: 80,  recommendedPerPersonPerDay: 0.05, category: "医薬品", imageVerified: false },
];
