<script>
  // 機能部分は仮実装
  let isPlaying = false;
  let currentSong = {
    title: '選択された曲はありません',
    artist: {
      name: ''
    },
    imageUrl: '/img/song_default.webp'
  };
  let currentTime = 0;
  let duration = 180; // 仮の曲の長さ（秒）
  let volume = 0.5; // 0から1の間の値

  // 再生/一時停止ボタンのクリックハンドラ（仮実装）
  function togglePlay() {
    isPlaying = !isPlaying;
  }

  // 時間のフォーマット
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
</script>

<div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 border-t border-gray-700 shadow-lg">
  <div class="container mx-auto flex items-center justify-between">
    <!-- 左側：曲情報 -->
    <div class="flex items-center space-x-3 w-1/4">
      <img 
        src={currentSong.imageUrl} 
        alt="アルバムアート" 
        class="w-12 h-12 object-cover rounded-sm"
      />
      <div>
        <h3 class="font-bold truncate">{currentSong.title}</h3>
        <p class="text-sm text-gray-300 truncate">{currentSong.artist.name}</p>
      </div>
    </div>

    <!-- 中央：再生コントロールと進行バー -->
    <div class="flex items-center w-2/4 space-x-4">
      <!-- 再生/一時停止ボタン -->
      <button 
        class="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 focus:outline-none flex-shrink-0"
        on:click={togglePlay}
      >
        {#if isPlaying}
          <!-- 一時停止アイコン（シンプル版） -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        {:else}
          <!-- 再生アイコン（シンプル版） -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        {/if}
      </button>

      <!-- 時間表示 - 再生/一時停止ボタンの隣に配置 -->
      <span class="text-xs w-16 text-right flex-shrink-0">{formatTime(currentTime)}/{formatTime(duration)}</span>

      <!-- 進行バー -->
      <div class="w-full">
        <div class="relative w-full h-1 bg-gray-600 rounded-full">
          <div 
            class="absolute top-0 left-0 h-1 bg-white rounded-full" 
            style="width: {(currentTime / duration) * 100}%"
          ></div>
        </div>
      </div>
    </div>

    <!-- 右側：音量コントロール -->
    <div class="flex items-center space-x-2 w-1/4 justify-end">
      <!-- スピーカーアイコン（シンプル版） -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,9v6h4l5,5V4L7,9H3z"/>
        <path d="M16.5,12c0-1.8-1-3.3-2.5-4v8C15.5,15.3,16.5,13.8,16.5,12z"/>
        <path d="M14,3.2v2.1c2.9,0.9,5,3.5,5,6.7s-2.1,5.8-5,6.7v2.1c4-0.9,7-4.5,7-8.8S18,4.1,14,3.2z"/>
      </svg>

      <!-- 音量スライダー -->
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        bind:value={volume}
        class="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </div>
</div>
