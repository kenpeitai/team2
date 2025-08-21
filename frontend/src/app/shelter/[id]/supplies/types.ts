export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Category = "医薬品" | "衛生" | "食料" | "生活用品";

export interface Product {
  id: string;
  name: string;
  unit: string;              // 例: 本, 食, パック, 枚, 缶, 箱, ケース
  weightGrams: number;       // 1単位あたり重量(g) — 水は ≒ mL とみなす
  recommendedPerPersonPerDay?: number; // 推奨/人/日（例: ごはん0.2箱など）
  imageUrl?: string;         // 商品画像
  imageVerified?: boolean;   // 画像の正確性が検証済みかどうか
  category: Category;
  // 楽天市場情報
  price?: number;            // 楽天市場での価格
  shop?: string;             // 楽天市場のショップ名
  url?: string;              // 楽天市場の商品URL
  rakutenActualProductName?: string; // 楽天市場から取得した実際の商品名
  searchKeyword?: string;    // 楽天市場検索に使用したキーワード
}

export interface NeedRow {
  id: string;         // UI用行ID
  productId: string;  // CATALOG/props.products から選択
  quantity: number;   // 自由入力
  priority: Priority; // 緊急度
  notes?: string;
}

// === バックエンドが扱いやすい拡張ペイロード ===
export interface NeedsListPayload {
  evacueeCount: number;
  targetDays: number;
  items: Array<{
    // 基本
    id: string;                 // 行ID（参照用）
    productId: string;
    productName: string;
    unit: string;
    category: Category;
    quantity: number;
    priority: Priority;
    notes?: string;

    // 重量
    perUnitWeightGrams: number; // 単位重量
    totalWeightGrams: number;   // 行合計重量

    // ドローン（後方互換: droneEligible は全量一括の可否）
    droneEligible: boolean;           // = droneEligibleWholeOrder（互換フィールド）
    droneEligibleWholeOrder: boolean; // 全量を1フライトで運べるか
    dronePerUnitEligible: boolean;    // 1単位が積載上限以下か（分割搬送の可否）
    droneUnitsPerFlight: number | null;   // 1フライトで運べる単位数（分割前提）
    droneFlightsRequired: number | null;  // 全量を運ぶのに必要なフライト数（分割前提）
  }>;

  // 集計 & グルーピング
  analytics: {
    totals: { units: number; weightGrams: number; waterCases: number };
    byPriority: Record<Priority, {
      lineCount: number;
      units: number;
      weightGrams: number;
      itemIds: string[]; // rowsのid
    }>;
    drone: {
      payloadLimitGrams: number;
      wholeOrderEligibleIds: string[];
      wholeOrderIneligibleIds: string[];
      flights: Array<{
        id: string;                 // 行ID
        productId: string;
        unitsPerFlight: number | null;
        flightsRequired: number | null;
      }>;
    };
  };
}

export interface SuppliesState {
  evacueeCount: number;
  targetDays: number;
  rows: NeedRow[];
  saving: boolean;
  imageStates: Record<string, {
    src: string | null;
    candidates: string[];
    open: boolean;
  }>;
}

export type SuppliesAction = 
  | { type: 'SET_EVACUEE_COUNT'; payload: number }
  | { type: 'SET_TARGET_DAYS'; payload: number }
  | { type: 'SET_ROWS'; payload: NeedRow[] }
  | { type: 'UPDATE_ROW'; payload: { id: string; updates: Partial<NeedRow> } }
  | { type: 'ADD_ROW'; payload: NeedRow }
  | { type: 'REMOVE_ROW'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_IMAGE_STATE'; payload: { productId: string; updates: Partial<SuppliesState['imageStates'][string]> } };
