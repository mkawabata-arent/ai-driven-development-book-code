<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import type { SongWithArtist } from '$lib/type';
  import { favoriteIds } from '$lib/module/favorite';

  // 実際のお気に入り曲データを格納する配列
  let favoriteSongs: SongWithArtist[] = [];
  let loading = true;
  let error: string | null = null;

  // お気に入りIDをもとに曲情報を取得
  async function loadFavoriteSongs() {
    loading = true;
    error = null;
    
    try {
      // favoriteIdsストアからお気に入りIDリストを取得
      let favoriteList: number[] = [];
      const unsubscribe = favoriteIds.subscribe(ids => {
        favoriteList = ids;
      });
      unsubscribe();
      
      console.log('お気に入りID一覧:', favoriteList);
      
      // お気に入りがない場合は早期リターン
      if (favoriteList.length === 0) {
        favoriteSongs = [];
        loading = false;
        return;
      }
      
      // APIから曲データを取得（カンマ区切りでIDを渡す）
      const ids = favoriteList.join(',');
      const response = await fetch(`/api/songs?id=${ids}`);
      
      if (!response.ok) {
        throw new Error('お気に入り曲の取得に失敗しました');
      }
      
      const data = await response.json();
      console.log('取得したお気に入り曲データ:', data);
      favoriteSongs = data;
    } catch (err) {
      console.error('お気に入り曲の読み込みエラー:', err);
      error = err instanceof Error ? err.message : 'お気に入り曲の読み込み中にエラーが発生しました';
    } finally {
      loading = false;
    }
  }

  // お気に入り状態が変更されたら曲一覧を更新
  const unsubscribe = favoriteIds.subscribe(() => {
    if (typeof window !== 'undefined') {
      loadFavoriteSongs();
    }
  });

  // コンポーネント初期化時にデータを読み込み
  onMount(() => {
    loadFavoriteSongs();
    return () => {
      unsubscribe(); // コンポーネントがアンマウントされたら購読を解除
    };
  });
</script>

<svelte:head>
  <title>お気に入り | 音楽アプリ</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 text-gray-100">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold text-white">お気に入り</h1>
  </div>
  
  {#if loading}
    <!-- ローディング表示 -->
    <div class="flex justify-center items-center p-8">
      <div class="text-white">読み込み中...</div>
    </div>
  {:else if error}
    <!-- エラー表示 -->
    <div class="bg-red-600 text-white p-4 rounded mb-4">
      <p>{error}</p>
      <button 
        class="mt-2 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
        on:click={loadFavoriteSongs}
      >
        再読み込み
      </button>
    </div>
  {:else if favoriteSongs.length === 0}
    <!-- お気に入りがない場合のメッセージ -->
    <div class="bg-gray-800 rounded-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h2 class="text-2xl font-semibold text-gray-300 mb-2">お気に入りに追加されている曲はありません</h2>
      <p class="text-gray-400">曲カードのハートアイコンをクリックして、お気に入りに曲を追加してください。</p>
    </div>
  {:else}
    <!-- お気に入りの曲リスト -->
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {#each favoriteSongs as song}
          <div class="flex justify-center">
            <SongCard {song} />
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
