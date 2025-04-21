<script>
  // 状態変数（後で実際のストアに置き換え予定）
  let isPlaying = false;
  let currentSong = {
    title: '再生中の曲はありません',
    artist: {
      name: 'アーティスト名'
    },
    imageUrl: '/img/song_default.webp'
  };
  let audioDuration = 180; // 3分 = 180秒
  let currentTime = 0;
  let volume = 0.7; // 0.0 から 1.0 の間

  // 再生/一時停止トグル関数
  function togglePlay() {
    isPlaying = !isPlaying;
    // ここに実際の再生/一時停止ロジックが入ります
  }

  // 時間フォーマット関数（秒を「分:秒」形式に変換）
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 音量変更ハンドラー
  function handleVolumeChange(event) {
    volume = parseFloat(event.target.value);
    // ここに実際の音量変更ロジックが入ります
  }

  // 進行バー変更ハンドラー
  function handleProgressChange(event) {
    currentTime = parseFloat(event.target.value);
    // ここに実際の再生位置変更ロジックが入ります
  }
</script>

<div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 border-t border-gray-700 z-50">
  <div class="container mx-auto flex items-center justify-between">
    <!-- 曲情報 (左) -->
    <div class="flex items-center space-x-3 w-1/4">
      <img 
        src={currentSong.imageUrl || '/img/song_default.webp'} 
        alt="アルバムアート" 
        class="w-12 h-12 object-cover rounded"
      />
      <div class="overflow-hidden">
        <h3 class="font-bold text-sm truncate">{currentSong.title}</h3>
        <p class="text-xs text-gray-400 truncate">{currentSong.artist.name}</p>
      </div>
    </div>

    <!-- 再生コントロールと進行バー (中央) -->
    <div class="w-2/4 flex items-center justify-center space-x-4">
      <!-- 再生ボタン -->
      <button 
        on:click={togglePlay}
        class="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition-colors flex-shrink-0"
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

      <!-- 進行バーと時間 -->
      <div class="w-full flex items-center space-x-2">
        <span class="text-xs w-10 text-right">{formatTime(currentTime)}</span>
        <input 
          type="range" 
          min="0" 
          max={audioDuration} 
          value={currentTime}
          on:input={handleProgressChange}
          class="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <span class="text-xs w-10">{formatTime(audioDuration)}</span>
      </div>
    </div>

    <!-- 音量コントロール (右) -->
    <div class="flex items-center space-x-2 w-1/4 justify-end">
      <!-- スピーカーアイコン -->
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 3v2.05c3.89.89 7 4.33 7 8.95 0 4.62-3.11 8.06-7 8.95V23c5.05-.94 9-5.44 9-11 0-5.56-3.95-10.06-9-11zm-7 8v2h4l5 5V6L9 11H5z" />
      </svg>

      <!-- 音量スライダー -->
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume}
        on:input={handleVolumeChange}
        class="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  </div>
</div>
