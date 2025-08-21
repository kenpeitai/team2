import { useState, useEffect, useCallback } from 'react';
import { getCheapestItemByKeyword } from '@/lib/api/rakuten';
import { RAKUTEN_PRODUCT_CATALOG, RakutenProductDefinition } from '../rakutenCatalog';
import { Product } from '../types';

// ===== 型定義 =====

/**
 * 楽天市場から取得した商品データの型
 * 基本商品情報 + 楽天市場の詳細情報を保持
 */
export interface RakutenProductData extends Product {
  // 元の商品定義の基本情報（データベース保存用）
  baseProductId: string; // 元の商品ID（例: m-throat-candy）
  baseName: string;      // 元の商品名（例: のど飴）
  
  // 楽天市場から取得した商品情報
  rakutenItem?: {
    name: string;        // 楽天市場の商品名
    price: number;       // 価格
    url: string;         // 商品URL
    image?: string;      // 商品画像URL
    shop: string;        // ショップ名
    rating?: number;     // 評価
    reviews?: number;    // レビュー数
    itemCode?: string;   // 楽天市場商品コード
  };
  
  // 検索状態管理
  searchStatus: 'idle' | 'loading' | 'success' | 'error';
  lastSearched?: string; // 最後に検索したキーワード
  rakutenId?: string;    // 楽天市場商品のID
}

// ===== 定数 =====

const API_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_RAKUTEN_API_DELAY || '1500'); // API呼び出し間隔（ミリ秒）
const MAX_RETRIES = 3; // 最大リトライ回数
const CACHE_DURATION = 30 * 60 * 1000; // 30分間キャッシュ

// ===== メインフック =====

/**
 * 楽天市場商品データ管理フック
 * 商品カタログの初期化、楽天市場API検索、キャッシュ管理を担当
 */
export function useRakutenProducts(onProductsReady?: (products: Product[]) => void) {
  // ===== 状態管理 =====
  const [products, setProducts] = useState<Map<string, RakutenProductData>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchCache, setSearchCache] = useState<Map<string, { data: RakutenProductData['rakutenItem'] | null; timestamp: number }>>(new Map());

  // ===== 初期化処理 =====
  
  /**
   * 商品カタログの初期化
   * 楽天市場商品カタログから基本データを作成
   */
  useEffect(() => {
    const initialProducts = new Map<string, RakutenProductData>();
    
    RAKUTEN_PRODUCT_CATALOG.forEach(definition => {
      initialProducts.set(definition.id, {
        id: definition.id,
        name: definition.name,
        unit: definition.unit,
        weightGrams: definition.weightGrams,
        category: definition.category,
        recommendedPerPersonPerDay: definition.recommendedPerPersonPerDay,
        imageVerified: false,
        searchStatus: 'idle',
        // 元の商品定義の基本情報を保持
        baseProductId: definition.id,
        baseName: definition.name
      });
    });
    
    setProducts(initialProducts);
    setIsInitialized(true);
  }, []);

  // ===== ユーティリティ関数 =====
  
  /**
   * 楽天市場商品のIDを生成
   * @param baseId 基本商品ID
   * @param itemCode 楽天市場商品コード
   * @returns 楽天市場商品ID
   */
  const generateRakutenProductId = useCallback((baseId: string, itemCode?: string): string => {
    if (itemCode) {
      return `rakuten-${baseId}-${itemCode}`;
    }
    return `rakuten-${baseId}-${Date.now()}`;
  }, []);

  // ===== 検索処理 =====
  
  /**
   * 特定の商品を楽天市場で検索（キャッシュ機能付き）
   * @param productId 商品ID
   * @param keyword 検索キーワード（省略時は商品定義から自動取得）
   */
  const searchProduct = useCallback(async (productId: string, keyword?: string) => {
    const product = products.get(productId);
    if (!product) return;

    const definition = RAKUTEN_PRODUCT_CATALOG.find(p => p.id === productId);
    if (!definition) return;

    // 検索キーワードを決定
    const searchKeyword = keyword || definition.searchKeywords[0];
    
    // キャッシュチェック
    const cacheKey = `${productId}:${searchKeyword}`;
    const cached = searchCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return new Promise<void>((resolve) => {
        setProducts(prev => {
          const newProducts = new Map(prev);
          const rakutenId = generateRakutenProductId(productId, cached.data?.itemCode);
          const updatedProduct: RakutenProductData = {
            ...product,
            searchStatus: cached.data ? 'success' : 'error',
            lastSearched: searchKeyword,
            rakutenItem: cached.data || undefined,
            rakutenId: cached.data ? rakutenId : undefined
          };
          newProducts.set(productId, updatedProduct);
          resolve();
          return newProducts;
        });
      });
    }
    
    // 既に同じキーワードで検索済みの場合はスキップ
    if (product.lastSearched === searchKeyword && product.searchStatus === 'success') {
      return Promise.resolve();
    }

    // 検索状態を更新
    setProducts(prev => {
      const newProducts = new Map(prev);
      const updatedProduct = { ...product, searchStatus: 'loading' as const, lastSearched: searchKeyword };
      newProducts.set(productId, updatedProduct);
      return newProducts;
    });

    // 楽天市場APIで検索（Promiseチェーンでエラー処理）
    return getCheapestItemByKeyword(searchKeyword)
      .then((rakutenItem) => {
        // キャッシュに保存
        setSearchCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, { data: rakutenItem, timestamp: now });
          return newCache;
        });
        return new Promise<void>((resolve) => {
          setProducts(prev => {
            const newProducts = new Map(prev);
            const rakutenId = generateRakutenProductId(productId, rakutenItem?.itemCode);
            const updatedProduct: RakutenProductData = {
              ...product,
              searchStatus: rakutenItem ? 'success' : 'error',
              lastSearched: searchKeyword,
              rakutenItem: rakutenItem || undefined,
              rakutenId: rakutenItem ? rakutenId : undefined
            };
            newProducts.set(productId, updatedProduct);
            // 状態更新後にresolve
            setTimeout(() => resolve(), 0);
            return newProducts;
          });
        });
      })
      .catch(() => {
        return new Promise<void>((resolve) => {
          setProducts(prev => {
            const newProducts = new Map(prev);
            const updatedProduct = { ...product, searchStatus: 'error' as const, lastSearched: searchKeyword };
            newProducts.set(productId, updatedProduct);
            // 状態更新後にresolve
            setTimeout(() => resolve(), 0);
            return newProducts;
          });
        });
      });
  }, [products, searchCache, generateRakutenProductId]);

  /**
   * 複数の商品を順次検索（レート制限対応）
   * @param productIds 検索する商品IDの配列
   */
  const searchMultipleProducts = useCallback(async (productIds: string[]) => {
    // 商品を1つずつ順次処理（レート制限対応）
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      await searchProduct(productId);
      
      // 商品間の待機時間（API制限対応）
      if (i < productIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
      }
    }
  }, [searchProduct]);

  /**
   * 全商品を検索（優先度付き）
   * 医薬品 → 食料 → 生活用品 → 衛生の順で検索
   */
  const searchAllProducts = useCallback(async () => {
    // 優先度順に商品を並べ替え（医薬品 → 食料 → 生活用品 → 衛生）
    const priorityOrder = ['医薬品', '食料', '生活用品', '衛生'];
    const sortedProducts = [...RAKUTEN_PRODUCT_CATALOG].sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.category);
      const bIndex = priorityOrder.indexOf(b.category);
      return aIndex - bIndex;
    });
    
    const allProductIds = sortedProducts.map(p => p.id);
    await searchMultipleProducts(allProductIds);
    
    // 検索完了後に状態更新の完了を待つ
    await new Promise(resolve => setTimeout(resolve, 500));
  }, [searchMultipleProducts, products]);

  // ===== データ取得関数 =====
  
  /**
   * データベース保存用の商品データを取得
   * 元の商品定義のプロパティを保持
   */
  const getProductsForDatabase = useCallback((): Product[] => {
    return Array.from(products.values()).map(product => {
      // 楽天市場データがある場合でも、元の商品定義のプロパティを保持
      if (product.rakutenItem) {
        return {
          id: product.baseProductId, // 元の商品IDを保持（例: m-throat-candy）
          name: product.baseName,     // 元の商品名を保持（例: のど飴）
          unit: product.unit,
          weightGrams: product.weightGrams,
          category: product.category,
          recommendedPerPersonPerDay: product.recommendedPerPersonPerDay,
          // 楽天市場の画像情報
          imageUrl: product.rakutenItem.image,
          imageVerified: true,
          // 楽天市場の価格・ショップ情報
          price: product.rakutenItem.price,
          shop: product.rakutenItem.shop,
          url: product.rakutenItem.url,
          // 楽天市場から取得した実際の商品名
          rakutenActualProductName: product.rakutenItem.name
        };
      }
      
      // 楽天市場データがない場合は、基本データを使用
      return {
        id: product.id,
        name: product.name,
        unit: product.unit,
        weightGrams: product.weightGrams,
        category: product.category,
        recommendedPerPersonPerDay: product.recommendedPerPersonPerDay,
        imageUrl: undefined,
        imageVerified: false
      };
    });
  }, [products]);

  /**
   * 表示用の商品データを取得（楽天市場商品IDを使用）
   * 楽天市場データがある場合は楽天市場の商品名をメインとして使用
   */
  const getProductsAsArray = useCallback((): Product[] => {
    const productsArray = Array.from(products.values());
    const rakutenProducts = productsArray.filter(p => p.rakutenItem);
    const basicProducts = productsArray.filter(p => !p.rakutenItem);
    
    return productsArray.map(product => {
      // 楽天市場データがある場合は、楽天市場商品IDを使用
      if (product.rakutenItem) {
        const rakutenId = generateRakutenProductId(product.id, product.rakutenItem.itemCode);
        
        return {
          id: product.baseProductId, // 元の商品IDを保持（例: p-water-2l）
          name: product.rakutenItem.name, // 楽天市場の商品名をメインのnameとして使用
          // 元の商品定義のプロパティを保持
          unit: product.unit,
          weightGrams: product.weightGrams,
          category: product.category,
          recommendedPerPersonPerDay: product.recommendedPerPersonPerDay,
          // 楽天市場の画像情報
          imageUrl: product.rakutenItem.image,
          imageVerified: true,
          // 楽天市場の価格・ショップ情報
          price: product.rakutenItem.price,
          shop: product.rakutenItem.shop,
          url: product.rakutenItem.url,
          // 楽天市場から取得した実際の商品名
          rakutenActualProductName: product.rakutenItem.name,
          // 元の商品定義の名前を検索キーワードとして保持
          searchKeyword: product.baseName
        };
      }
      
      // 楽天市場データがない場合は、基本データを使用
      return {
        id: product.id,
        name: product.name,
        unit: product.unit,
        weightGrams: product.weightGrams,
        category: product.category,
        recommendedPerPersonPerDay: product.recommendedPerPersonPerDay,
        imageUrl: undefined,
        imageVerified: false
      };
    });
  }, [products, generateRakutenProductId]);

  /**
   * カテゴリ別にグループ化
   */
  const getProductsByCategory = useCallback(() => {
    const grouped = new Map();
    products.forEach(product => {
      if (!grouped.has(product.category)) {
        grouped.set(product.category, []);
      }
      grouped.get(product.category).push(product);
    });
    
    // 各カテゴリ内で名前順にソート
    grouped.forEach((productList: RakutenProductData[]) => {
      productList.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    });
    
    return grouped;
  }, [products]);

  /**
   * 検索状態の統計を取得
   */
  const getSearchStats = useCallback(() => {
    let idle = 0, loading = 0, success = 0, error = 0;
    products.forEach(product => {
      switch (product.searchStatus) {
        case 'idle': idle++; break;
        case 'loading': loading++; break;
        case 'success': success++; break;
        case 'error': error++; break;
      }
    });
    return { idle, loading, success, error };
  }, [products]);

  // ===== 戻り値 =====
  return {
    products,
    isInitialized,
    searchProduct,
    searchMultipleProducts,
    searchAllProducts,
    getProductsAsArray,
    getProductsForDatabase, // データベース保存用
    getProductsByCategory,
    getSearchStats
  };
}
