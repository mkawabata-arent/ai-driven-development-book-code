<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { 
    isPlaying, 
    currentSong, 
    playbackTime, 
    audioDuration, 
    currentVolume,
    playSong,
    stopSong,
    setVolume,
    seekTo,
    formatTime
  } from '$lib/module/player';
  import { fade } from 'svelte/transition';
  
  // プログレスバーの参照
  let progressBar: HTMLDivElement;
  
  // 購読の解除関数を保持する変数
  let unsubscribeIsPlaying: () => void;
  let unsubscribeCurrentSong: () => void;
  
  // ローカルの状態変数
  let playing = false;
  let song = null;
  let currentTime = 0;
  let duration = 0;
  let volume = 0.7;
  
  // ストアを購読して状態を更新
  onMount(() => {
    unsubscribeIsPlaying = isPlaying.subscribe(value => {
      playing = value;
    });
    
    unsubscribeCurrentSong = currentSong.subscribe(value => {
      song = value;
    });
    
    // 再生時間を購読
    const unsubscribePlaybackTime = playbackTime.subscribe(value => {
      currentTime = value;
    });
    
    // 曲の長さを購読
    const unsubscribeDuration = audioDuration.subscribe(value => {
      duration = value;
    });
    
    // 音量を購読
    const unsubscribeVolume = currentVolume.subscribe(value => {
      volume = value;
    });
    
    // コンポーネント破棄時に購読を解除
    return () => {
      unsubscribeIsPlaying();
      unsubscribeCurrentSong();
      unsubscribePlaybackTime();
      unsubscribeDuration();
      unsubscribeVolume();
    };
  });
  
  // 再生/一時停止を切り替える関数
  function togglePlay() {
    if (song) {
      if (playing) {
        stopSong();
      } else {
        playSong(song);
      }
    }
  }
  
  // シークバーをクリックしたときの処理
  function handleSeek(event: MouseEvent) {
    if (!progressBar || !duration) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const newPosition = clickPosition * duration;
    
    seekTo(newPosition);
  }
  
  // 音量を変更する関数
  function handleVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    setVolume(newVolume);
  }
  
  // 再生が終了しているかのチェック
  $: isEnded = duration > 0 && currentTime >= duration;
  
  // 進行割合の計算
  $: progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
</script>

{#if song}
<div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-10" transition:fade={{duration: 200}}>
  <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
    <!-- 曲情報 -->
    <div class="flex items-center mb-3 md:mb-0 md:w-1/3">
      <img 
        src={song.imageUrl || song.image || '/img/song_default.webp'} 
        alt={song.title} 
        class="w-16 h-16 object-cover rounded-md shadow-md mr-4"
      />
      <div>
        <h3 class="font-bold text-lg truncate">{song.title}</h3>
        <a href="/artists/{song.artistId}" class="text-gray-300 hover:text-white text-sm">
          {song.artist.name}
        </a>
      </div>
    </div>
    
    <!-- 再生コントロール -->
    <div class="flex flex-col items-center md:w-1/3">
      <button 
        class="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200 mb-2"
        on:click={togglePlay}
        aria-label={playing ? '一時停止' : '再生'}
      >
        {#if playing}
          <!-- 一時停止アイコン -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        {:else}
          <!-- 再生アイコン -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        {/if}
      </button>
      
      <!-- シークバー -->
      <div class="w-full flex items-center space-x-2">
        <span class="text-xs w-10 text-right">{formatTime(currentTime)}</span>
        
        <div 
          class="h-1 flex-grow bg-gray-600 rounded-full cursor-pointer relative" 
          on:click={handleSeek}
          bind:this={progressBar}
        >
          <div 
            class="absolute top-0 left-0 h-full bg-white rounded-full" 
            style="width: {progressPercent}%"
          ></div>
        </div>
        
        <span class="text-xs w-10">{formatTime(duration)}</span>
      </div>
    </div>
    
    <!-- 音量コントロール -->
    <div class="flex items-center mt-2 md:mt-0 md:w-1/3 md:justify-end">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
      </svg>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume}
        on:input={handleVolumeChange}
        class="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </div>
</div>
{/if} 