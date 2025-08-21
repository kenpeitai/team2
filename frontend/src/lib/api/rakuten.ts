// 楽天市場APIの型定義
export interface RakutenItem {
  name: string;
  price: number;
  url: string;
  image?: string;
  shop: string;
  rating?: number;
  reviews?: number;
  itemCode?: string;  // 楽天市場の商品コード
}

// 最安1件を取る：キーワードは「製品名 型番」など具体的に。
export async function getCheapestItemByKeyword(keyword: string): Promise<RakutenItem | null> {
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  
  if (!appId) {
    console.error('楽天市場APIのアプリケーションIDが設定されていません。.env.localファイルにNEXT_PUBLIC_RAKUTEN_APP_IDを設定してください。');
    return null;
  }

  const params = new URLSearchParams({
    applicationId: appId,
    format: "json",
    formatVersion: "2",          // レスポンスをフラット化
    keyword,                     // 製品名や型番/JANでもOK
    availability: "1",           // 在庫ありのみ
    imageFlag: "1",              // 画像ありのみ
    sort: "+itemPrice",          // 価格昇順 = 最安から
    hits: "1",                   // 1件だけ取得
    elements:
      "itemName,itemPrice,itemUrl,mediumImageUrls,shopName,reviewAverage,reviewCount,itemCode"
  });

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // 429(リクエスト上限)や404などAPI標準のエラーもあり得る
      if (res.status === 429) {
        console.warn('楽天市場APIレート制限に達しました。30秒待機します...');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30秒待機
        // リトライ（1回のみ）
        const retryRes = await fetch(url);
        if (!retryRes.ok) {
          console.error(`楽天市場API リトライ後もエラー: ${retryRes.status} ${retryRes.statusText}`);
          return null;
        }
        // リトライ成功時は後続処理を継続
      } else {
        console.error(`楽天市場API エラー: ${res.status} ${res.statusText}`);
        return null;
      }
    }

    const data = await res.json();
    
    // レスポンスの構造を確認（Items または items）
    const items = data.Items || data.items;
    const item = items?.[0];
    if (!item) {
      return null;
    }

    return {
      name: item.itemName as string,
      price: item.itemPrice as number,
      url: item.itemUrl as string,
      image: Array.isArray(item.mediumImageUrls) && item.mediumImageUrls.length > 0 
        ? item.mediumImageUrls[0] as string 
        : undefined,
      shop: item.shopName as string,
      rating: item.reviewAverage as number | undefined,
      reviews: item.reviewCount as number | undefined,
      itemCode: item.itemCode as string | undefined
    };
  } catch (error) {
    console.error('楽天市場API呼び出し中にエラーが発生しました:', error);
    return null;
  }
}

// 複数商品を取得する場合の関数（オプション）
export async function getItemsByKeyword(keyword: string, limit: number = 10): Promise<RakutenItem[]> {
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  
  if (!appId) {
    console.error('楽天市場APIのアプリケーションIDが設定されていません。');
    return [];
  }

  const params = new URLSearchParams({
    applicationId: appId,
    format: "json",
    formatVersion: "2",
    keyword,
    availability: "1",
    imageFlag: "1",
    sort: "+itemPrice",
    hits: limit.toString(),
    elements:
      "itemName,itemPrice,itemUrl,mediumImageUrls,shopName,reviewAverage,reviewCount,itemCode"
  });

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) {
        console.warn('楽天市場APIレート制限に達しました。30秒待機します...');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30秒待機
        // リトライ（1回のみ）
        const retryRes = await fetch(url);
        if (!retryRes.ok) {
          console.error(`楽天市場API リトライ後もエラー: ${retryRes.status} ${retryRes.statusText}`);
          return [];
        }
        // リトライ成功時は後続処理を継続
      } else {
        console.error(`楽天市場API エラー: ${res.status} ${res.statusText}`);
        return [];
      }
    }

    const data = await res.json();
    
    // レスポンスの構造を確認（Items または items）
    const items = data.Items || data.items || [];

    return items.map((item: any) => ({
      name: item.itemName as string,
      price: item.itemPrice as number,
      url: item.itemUrl as string,
      image: Array.isArray(item.mediumImageUrls) && item.mediumImageUrls.length > 0 
        ? item.mediumImageUrls[0] as string 
        : undefined,
      shop: item.shopName as string,
      rating: item.reviewAverage as number | undefined,
      reviews: item.reviewCount as number | undefined,
      itemCode: item.itemCode as string | undefined
    }));
  } catch (error) {
    console.error('楽天市場API呼び出し中にエラーが発生しました:', error);
    return [];
  }
}
