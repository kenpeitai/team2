export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Category = "医薬品" | "衛生" | "食料" | "生活用品";

export interface NeedsListPayload {
  evacueeCount: number;
  targetDays: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unit: string;
    category: Category;
    quantity: number;
    priority: Priority;
    notes?: string;

    perUnitWeightGrams: number;
    totalWeightGrams: number;

    droneEligible: boolean;            // 後方互換
    droneEligibleWholeOrder: boolean;  // 全量一括で可
    dronePerUnitEligible: boolean;     // 1単位なら可
    droneUnitsPerFlight: number | null;
    droneFlightsRequired: number | null;
  }>;
  analytics: {
    totals: { units: number; weightGrams: number; waterCases: number };
    byPriority: Record<
      Priority,
      { lineCount: number; units: number; weightGrams: number; itemIds: string[] }
    >;
    drone: {
      payloadLimitGrams: number;
      wholeOrderEligibleIds: string[];
      wholeOrderIneligibleIds: string[];
      flights: Array<{
        id: string;
        productId: string;
        unitsPerFlight: number | null;
        flightsRequired: number | null;
      }>;
    };
  };
}

export type StoredNeeds = { savedAtISO: string; payload: NeedsListPayload };
