<script lang="ts">
  import type { SongWithArtist } from '$lib/type';
  import { favoriteIds, addToFavorite, removeFromFavorite } from '$lib/module/favorite';
  import { onMount } from 'svelte';
  import { isPlaying, currentSong, playSong, stopSong } from '$lib/module/player';

  // songプロパティを受け取る（SongWithArtist型）
  export let song: SongWithArtist;
  
  // 曲の画像URL
  const imageUrl = song.imageUrl || song.image || 'https://placehold.jp/300x300.png?text=NO%20IMAGE';
  
  // お気に入り状態の監視 (リアクティブな宣言を使用)
  $: isFavorite = $favoriteIds.includes(Number(song.id));
  
  // 再生状態の監視
  $: isCurrentlyPlaying = $isPlaying && $currentSong && $currentSong.id === song.id;

  // 再生ボタンのクリックハンドラ
  function togglePlay() {
    if (isCurrentlyPlaying) {
      stopSong();
    } else {
      playSong(song);
    }
  }

  // お気に入りボタンのクリックハンドラ
  function toggleFavorite() {
    if (isFavorite) {
      // お気に入りから削除
      removeFromFavorite(song.id);
      alert(`「${song.title}」をお気に入りから削除しました`);
      console.log(`「${song.title}」(ID: ${song.id})をお気に入りから削除しました`);
    } else {
      // お気に入りに追加
      addToFavorite(song.id);
      alert(`「${song.title}」をお気に入りに追加しました`);
      console.log(`「${song.title}」(ID: ${song.id})をお気に入りに追加しました`);
    }
  }
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-64">
  <!-- 上部：アートワーク -->
  <div class="relative">
    <img 
      src={imageUrl} 
      alt={`${song.title}のアートワーク`} 
      class="w-full h-48 object-cover"
    />
    <div class="absolute inset-0 bg-black bg-opacity-20"></div>
  </div>

  <!-- 中央：曲情報 -->
  <div class="p-4">
    <h3 class="text-white font-bold text-lg truncate">{song.title}</h3>
    <a href="/artists/{song.artistId}" class="text-gray-300 text-sm hover:text-gray-100 truncate block">
      {song.artist.name}
    </a>
  </div>
  
  <!-- 下部：コントロール -->
  <div class="p-4 pt-0 flex items-center justify-between">
    <!-- 再生ボタン -->
    <button 
      class="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 focus:outline-none"
      on:click={togglePlay}
      aria-label={isCurrentlyPlaying ? '一時停止' : '再生'}
    >
      {#if isCurrentlyPlaying}
        <!-- 一時停止アイコン -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      {:else}
        <!-- 再生アイコン -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      {/if}
    </button>

    <!-- お気に入りボタン -->
    <button 
      class="text-white focus:outline-none"
      on:click={toggleFavorite}
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {#if isFavorite}
        <!-- お気に入り済み -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      {:else}
        <!-- お気に入りでない -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      {/if}
    </button>
  </div>
</div>
