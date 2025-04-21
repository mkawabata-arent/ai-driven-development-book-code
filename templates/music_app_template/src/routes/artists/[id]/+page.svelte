<script lang="ts">
  import type { ArtistWithSongs } from '$lib/type';
  import SongCard from '$lib/components/SongCard.svelte';
  
  // ページパラメータから[id]を取得する (実際の実装では$page.params.idなどで取得)
  // ここでは仮のIDを設定
  const artistId = 1;
  
  // 仮のアーティストデータ
  const artist: ArtistWithSongs = {
    id: artistId,
    name: 'テストアーティスト1',
    profile: '音楽活動10年のベテラン。新しいアルバムを発表予定。様々なジャンルの音楽を作り、多くのファンから支持されています。最近ではニューアルバム「素晴らしい世界」をリリースし、好評を博しています。コンサートやフェスティバルでの演奏も精力的に行い、ライブパフォーマンスも高く評価されています。',
    imageUrl: '/img/artist_default.webp',
    createdAt: new Date(),
    updatedAt: new Date(),
    songs: [
      {
        id: 1,
        title: '夏の思い出',
        imageUrl: '/img/song_default.webp',
        audioUrl: '/audio/test1.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
        artistId: artistId,
        artist: null // SongCardコンポーネントで使用するのでartistを追加
      },
      {
        id: 6,
        title: '永遠の約束',
        imageUrl: '/img/song_default.webp',
        audioUrl: '/audio/test6.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
        artistId: artistId,
        artist: null
      },
      {
        id: 7,
        title: '星空の下で',
        imageUrl: '/img/song_default.webp',
        audioUrl: '/audio/test7.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
        artistId: artistId,
        artist: null
      }
    ]
  };
  
  // songオブジェクトにartistを設定（循環参照を回避するため新しいオブジェクトを作成）
  const songsWithArtist = artist.songs.map(song => ({
    ...song,
    artist: {
      id: artist.id,
      name: artist.name,
      profile: artist.profile,
      imageUrl: artist.imageUrl,
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt
    }
  }));
</script>

<div class="container mx-auto px-4 py-8">
  <!-- アーティスト情報セクション -->
  <section class="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
    <div class="md:flex">
      <!-- アーティスト画像（左側） -->
      <div class="md:w-1/3">
        <img 
          src={artist.imageUrl} 
          alt="{artist.name}の画像"
          class="w-full h-full object-cover object-center"
        />
      </div>
      
      <!-- アーティスト情報（右側） -->
      <div class="p-6 md:w-2/3">
        <h1 class="text-4xl font-bold text-white mb-4">{artist.name}</h1>
        <p class="text-gray-300 mb-4 leading-relaxed">{artist.profile}</p>
        
        <div class="flex items-center text-gray-400">
          <span class="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            {artist.songs.length} 曲
          </span>
        </div>
      </div>
    </div>
  </section>
  
  <!-- 曲一覧セクション -->
  <section class="bg-gray-800 rounded-lg p-6 shadow-lg">
    <h2 class="text-3xl font-bold text-white mb-6">曲一覧</h2>
    
    {#if songsWithArtist.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each songsWithArtist as song}
          <div class="flex justify-center">
            <SongCard {song} />
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-300 text-center py-6">このアーティストの曲はまだありません。</p>
    {/if}
  </section>

  <!-- 戻るボタン -->
  <div class="mt-8 text-center">
    <a href="/" class="inline-flex items-center text-indigo-300 hover:text-indigo-200 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      ホームに戻る
    </a>
  </div>
</div>
