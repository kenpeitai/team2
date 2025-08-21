import { useMemo } from "react";
import { Product, NeedRow, Category } from "../types";

export function useProductCatalog(catalog: Product[], rows: NeedRow[]) {
  const productMap = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);
  
  const grouped = useMemo(() => {
    const g = new Map<Category, Product[]>();
    catalog.forEach((p) => {
      if (!g.has(p.category)) g.set(p.category, []);
      g.get(p.category)!.push(p);
    });
    g.forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name, "ja")));
    return g;
  }, [catalog]);

  // ==== 重複選択禁止 ====
  const selectedIds = useMemo(() => new Set(rows.map(r => r.productId).filter(Boolean)), [rows]);

  return { productMap, grouped, selectedIds };
}
