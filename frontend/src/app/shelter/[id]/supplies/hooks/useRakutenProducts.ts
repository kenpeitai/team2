import { useState, useEffect, useCallback } from 'react';
import { getCheapestItemByKeyword } from '@/lib/api/rakuten';
import { RAKUTEN_PRODUCT_CATALOG, RakutenProductDefinition } from '../rakutenCatalog';
import { Product } from '../types';

// 楽天市場から取得した商品データの型
export interface RakutenProductData extends Product {
  // 元の商品定義の基本情報（データベース保存用）
  baseProductId: string; // 元の商品ID（例: m-throat-candy）
  baseName: string;      // 元の商品名（例: のど飴）
  
  rakutenItem?: {
    name: string;
    price: number;
    url: string;
    image?: string;
    shop: string;
    rating?: number;
    reviews?: number;
    itemCode?: string;
  };
  searchStatus: 'idle' | 'loading' | 'success' | 'error';
  lastSearched?: string;
  rakutenId?: string; // 楽天市場商品のID
}

// 楽天市場商品データ管理フック
export function useRakutenProducts() {
  const [products, setProducts] = useState<Map<string, RakutenProductData>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 楽天市場API制限設定
  const API_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_RAKUTEN_API_DELAY || '2000'); // API呼び出し間隔（ミリ秒）
  const MAX_RETRIES = 3; // 最大リトライ回数
  
  // キャッシュ機能
  const [searchCache, setSearchCache] = useState<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 30 * 60 * 1000; // 30分間キャッシュ

  // 初期化：楽天市場商品カタログから基本データを作成
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

  // 特定の商品を楽天市場で検索
  const searchProduct = useCallback(async (productId: string, keyword?: string) => {
    const product = products.get(productId);
    if (!product) return;

    const definition = RAKUTEN_PRODUCT_CATALOG.find(p => p.id === productId);
    if (!definition) return;

    // 検索キーワードを決定
    const searchKeyword = keyword || definition.searchKeywords[0];
    
    // 既に同じキーワードで検索済みの場合はスキップ
    if (product.lastSearched === searchKeyword && product.searchStatus === 'success') {
      return;
    }

    // 検索状態を更新
    setProducts(prev => {
      const newProducts = new Map(prev);
      const updatedProduct = { ...product, searchStatus: 'loading' as const, lastSearched: searchKeyword };
      newProducts.set(productId, updatedProduct);
      return newProducts;
    });

    try {
      // 楽天市場APIで検索
      const rakutenItem = await getCheapestItemByKeyword(searchKeyword);
      
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
        
        // デバッグ用：楽天市場データの取得状況をログ出力
        if (rakutenItem) {
          console.log(`楽天市場データ取得成功 (${productId}):`, {
            name: rakutenItem.name,
            price: rakutenItem.price,
            shop: rakutenItem.shop
          });
        }
        
        return newProducts;
      });
    } catch (error) {
      console.error(`楽天市場検索エラー (${productId}):`, error);
      
      setProducts(prev => {
        const newProducts = new Map(prev);
        const updatedProduct = { ...product, searchStatus: 'error' as const, lastSearched: searchKeyword };
        newProducts.set(productId, updatedProduct);
        return newProducts;
      });
    }
  }, [products]);

  // 複数の商品を並列検索（バッチ処理で高速化）
  const searchMultipleProducts = useCallback(async (productIds: string[]) => {
    const BATCH_SIZE = 3; // 同時に処理する商品数
    const batches = [];
    
    // 商品IDをバッチに分割
    for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
      batches.push(productIds.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`楽天市場API並列検索開始: ${productIds.length}商品を${batches.length}バッチで処理`);
    
    // バッチごとに並列処理
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`バッチ ${batchIndex + 1}/${batches.length} 処理中: ${batch.join(', ')}`);
      
      // バッチ内の商品を並列検索
      const promises = batch.map(productId => searchProduct(productId));
      await Promise.all(promises);
      
      // バッチ間の待機時間（API制限対応）
      if (batchIndex < batches.length - 1) {
        console.log(`バッチ間待機: ${API_DELAY_MS}ms待機中...`);
        await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
      }
    }
    
    console.log('楽天市場API並列検索完了');
  }, [searchProduct]);

  // 全商品を検索
  const searchAllProducts = useCallback(async () => {
    const allProductIds = RAKUTEN_PRODUCT_CATALOG.map(p => p.id);
    await searchMultipleProducts(allProductIds);
  }, [searchMultipleProducts]);

  // 楽天市場商品のIDを生成する関数
  const generateRakutenProductId = useCallback((baseId: string, itemCode?: string): string => {
    if (itemCode) {
      // 楽天市場の商品コードがある場合は、それを使用してIDを生成
      return `rakuten-${baseId}-${itemCode}`;
    }
    // 商品コードがない場合は、タイムスタンプベースのIDを生成
    return `rakuten-${baseId}-${Date.now()}`;
  }, []);

  // データベース保存用の商品データを取得（元の商品定義のプロパティを保持）
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

  // 表示用の商品データを取得（楽天市場商品IDを使用）
  const getProductsAsArray = useCallback((): Product[] => {
    console.log('getProductsAsArray called, products count:', products.size);
    return Array.from(products.values()).map(product => {
      // 楽天市場データがある場合は、楽天市場商品IDを使用
      if (product.rakutenItem) {
        console.log('楽天市場データあり:', product.id, product.rakutenItem.name);
        const rakutenId = generateRakutenProductId(product.id, product.rakutenItem.itemCode);
        
        // デバッグログ
        if (process.env.NODE_ENV === 'development') {
          console.log('Processing Rakuten item:', {
            productId: product.id,
            rakutenItemName: product.rakutenItem.name,
            baseName: product.baseName,
            generatedId: rakutenId
          });
        }
        
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

  // カテゴリ別にグループ化
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

  // 検索状態の統計
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
