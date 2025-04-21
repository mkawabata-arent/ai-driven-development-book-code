<script lang="ts">
  import type { SongWithArtist } from '$lib/type';
  
  // 曲データをプロパティとして受け取る（デフォルト値を設定）
  export let song: SongWithArtist = {
    id: 0,
    title: 'タイトルなし',
    imageUrl: '/img/song_default.webp',
    audioUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    artistId: 0,
    artist: {
      id: 0,
      name: 'アーティスト不明',
      profile: '',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
  
  // 再生状態（実際の機能実装時に使用）
  let isPlaying = false;
  
  // お気に入り状態（実際の機能実装時に使用）
  let isFavorite = false;
  
  // 再生ボタンのクリックハンドラ（仮実装）
  function handlePlay() {
    isPlaying = !isPlaying;
    console.log(`曲「${song.title}」の再生状態: ${isPlaying ? '再生中' : '停止'}`);
    // 実際の再生処理はここに実装
  }
  
  // お気に入りボタンのクリックハンドラ（仮実装）
  function handleFavorite() {
    isFavorite = !isFavorite;
    console.log(`曲「${song.title}」をお気に入り${isFavorite ? 'に追加' : 'から削除'}`);
    // 実際のお気に入り追加/削除処理はここに実装
  }
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
  <!-- 上部：アートワーク -->
  <div class="relative aspect-square overflow-hidden">
    <img 
      src={song.imageUrl || '/img/song_default.webp'} 
      alt="{song.title}のアートワーク" 
      class="w-full h-full object-cover"
    />
    
    <!-- 再生中オーバーレイ（再生中の場合のみ表示） -->
    {#if isPlaying}
      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div class="bg-white bg-opacity-90 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-gray-800">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- 中央：曲情報 -->
  <div class="p-4">
    <h3 class="text-lg font-bold text-white truncate">{song.title}</h3>
    <a href="/artists/{song.artist.id}" class="text-sm text-gray-400 hover:text-gray-300 truncate block mt-1">
      {song.artist.name}
    </a>
  </div>
  
  <!-- 下部：コントロールボタン -->
  <div class="px-4 pb-4 flex justify-between items-center">
    <!-- 再生ボタン -->
    <button 
      on:click={handlePlay} 
      class="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition-colors"
      aria-label={isPlaying ? '一時停止' : '再生'}
    >
      {#if isPlaying}
        <!-- 一時停止アイコン -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      {:else}
        <!-- 再生アイコン -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      {/if}
    </button>
    
    <!-- お気に入りボタン -->
    <button 
      on:click={handleFavorite} 
      class="text-white rounded-full w-10 h-10 flex items-center justify-center hover:text-pink-500 transition-colors"
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {#if isFavorite}
        <!-- お気に入り済みアイコン（塗りつぶし） -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-pink-500">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      {:else}
        <!-- お気に入り未追加アイコン（アウトライン） -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      {/if}
    </button>
  </div>
</div>
