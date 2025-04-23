import { writable } from 'svelte/store';

// LocalStorageのキー名
const FAVORITE_STORAGE_KEY = 'musicApp_favoriteSongs';

// お気に入りの曲IDリストを保持するストア
export const favoriteIds = writable<number[]>([]);

// 初期化関数 - ページロード時にLocalStorageからデータを取得
const initializeFavorites = () => {
  // サーバーサイドレンダリングで実行された場合は処理をスキップ
  if (typeof window === 'undefined') {
    console.log('サーバーサイドでの実行のため、LocalStorage初期化をスキップします');
    return;
  }

  try {
    console.log('LocalStorageからお気に入り情報を読み込み中...');
    const storedFavorites = localStorage.getItem(FAVORITE_STORAGE_KEY);
    
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        // 正しい形式かチェック
        if (Array.isArray(parsedFavorites)) {
          console.log('お気に入り情報を読み込みました:', parsedFavorites);
          favoriteIds.set(parsedFavorites);
        } else {
          console.warn('LocalStorageのデータが配列ではありません:', storedFavorites);
          // 不正な形式の場合は初期化
          localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([]));
        }
      } catch (parseError) {
        console.error('LocalStorageのデータのパースに失敗しました:', parseError);
        // 不正な形式の場合は初期化
        localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([]));
      }
    } else {
      console.log('LocalStorageにお気に入り情報がありません。新規作成します。');
      localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('お気に入りの読み込み中にエラーが発生しました:', error);
  }
};

// LocalStorageに保存する関数
const saveFavoritesToStorage = (ids: number[]) => {
  // サーバーサイドレンダリングで実行された場合は処理をスキップ
  if (typeof window === 'undefined') {
    console.log('サーバーサイドでの実行のため、LocalStorage保存をスキップします');
    return;
  }

  try {
    console.log('LocalStorageにお気に入り情報を保存します:', ids);
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('お気に入りの保存中にエラーが発生しました:', error);
  }
};

// お気に入りに曲を追加する
export const addToFavorite = (songId: number) => {
  console.log(`お気に入りに曲を追加します。ID: ${songId}, 型: ${typeof songId}`);
  
  // 数値型に変換（文字列の場合に対応）
  const numericId = Number(songId);
  
  if (isNaN(numericId)) {
    console.error('不正なIDが指定されました:', songId);
    return;
  }
  
  favoriteIds.update(ids => {
    console.log('現在のお気に入りリスト:', ids);
    
    // すでに存在する場合は追加しない
    if (ids.includes(numericId)) {
      console.log('既にお気に入りに追加されています');
      return ids;
    }
    
    const newIds = [...ids, numericId];
    console.log('更新後のお気に入りリスト:', newIds);
    saveFavoritesToStorage(newIds);
    return newIds;
  });
};

// お気に入りから曲を削除する
export const removeFromFavorite = (songId: number) => {
  console.log(`お気に入りから曲を削除します。ID: ${songId}, 型: ${typeof songId}`);
  
  // 数値型に変換（文字列の場合に対応）
  const numericId = Number(songId);
  
  if (isNaN(numericId)) {
    console.error('不正なIDが指定されました:', songId);
    return;
  }
  
  favoriteIds.update(ids => {
    console.log('現在のお気に入りリスト:', ids);
    
    const newIds = ids.filter(id => id !== numericId);
    console.log('更新後のお気に入りリスト:', newIds);
    saveFavoritesToStorage(newIds);
    return newIds;
  });
};

// お気に入りリストを取得する
export const getFavorite = () => {
  let result: number[] = [];
  favoriteIds.subscribe(ids => {
    result = ids;
  })();
  return result;
};

// お気に入りかどうかをチェックする便利関数
export const isFavorite = (songId: number) => {
  // 数値型に変換（文字列の場合に対応）
  const numericId = Number(songId);
  
  if (isNaN(numericId)) {
    console.error('不正なIDが指定されました:', songId);
    return false;
  }
  
  let result = false;
  favoriteIds.subscribe(ids => {
    result = ids.includes(numericId);
  })();
  return result;
};

// ブラウザ環境でのみ初期化を実行
if (typeof window !== 'undefined') {
  console.log('お気に入りモジュールを初期化します');
  // DOMContentLoadedイベント後に初期化を実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFavorites);
  } else {
    initializeFavorites();
  }
}
