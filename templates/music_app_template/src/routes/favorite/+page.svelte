<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte';
  import type { SongWithArtist } from '$lib/type';
  
  // お気に入りの有無を切り替えるフラグ（テスト用）
  let hasFavorites = true; // trueの場合はお気に入りあり、falseの場合はお気に入りなし
  
  // 仮のお気に入り曲データ
  const favoriteSongs: SongWithArtist[] = hasFavorites 
    ? [
        {
          id: 1,
          title: '夏の思い出',
          imageUrl: '/img/song_default.webp',
          audioUrl: '/audio/test1.mp3',
          createdAt: new Date(),
          updatedAt: new Date(),
          artistId: 1,
          artist: {
            id: 1,
            name: 'テストアーティスト1',
            profile: '音楽活動10年のベテラン。',
            imageUrl: '/img/artist_default.webp',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: 3,
          title: '雨の日のメロディー',
          imageUrl: '/img/song_default.webp',
          audioUrl: '/audio/test3.mp3',
          createdAt: new Date(),
          updatedAt: new Date(),
          artistId: 3,
          artist: {
            id: 3,
            name: '新人アーティスト',
            profile: 'デビューしたばかりの注目アーティスト。',
            imageUrl: '/img/artist_default.webp',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: 5,
          title: '都会のリズム',
          imageUrl: '/img/song_default.webp',
          audioUrl: '/audio/test5.mp3',
          createdAt: new Date(),
          updatedAt: new Date(),
          artistId: 5,
          artist: {
            id: 5,
            name: 'アーバンサウンド',
            profile: '都会的なサウンドで注目を集める。',
            imageUrl: '/img/artist_default.webp',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      ]
    : [];
    
  // お気に入りの切り替え関数（テスト用）
  function toggleFavoriteState() {
    hasFavorites = !hasFavorites;
    location.reload(); // 簡易的な実装のため、ページをリロード
  }
</script>

<div class="container mx-auto px-4 py-8">
  <!-- ページヘッダー -->
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-4xl font-bold text-white">お気に入り</h1>
      <p class="text-gray-300 mt-2">あなたがお気に入りに追加した曲の一覧です</p>
    </div>
    
    <!-- テスト用の切り替えボタン -->
    <button 
      on:click={toggleFavoriteState}
      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      テスト用：{hasFavorites ? 'お気に入りなしに切り替え' : 'お気に入りありに切り替え'}
    </button>
  </div>
  
  <!-- お気に入り曲一覧セクション -->
  <section class="bg-gray-800 rounded-lg p-6 shadow-lg">
    {#if favoriteSongs.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each favoriteSongs as song}
          <div class="flex justify-center">
            <SongCard {song} />
          </div>
        {/each}
      </div>
    {:else}
      <!-- お気に入りなしの場合 -->
      <div class="py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-white mb-2">お気に入りに追加されている曲はありません</h2>
        <p class="text-gray-400 mb-6">曲の詳細ページや曲カードから曲をお気に入りに追加できます</p>
        <a href="/" class="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          ホームに戻る
        </a>
      </div>
    {/if}
  </section>
  
  <!-- お気に入り機能の説明 -->
  <section class="mt-12 bg-gray-800 rounded-lg p-6 shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">お気に入り機能について</h2>
    <div class="text-gray-300 space-y-4">
      <p>お気に入り機能では、気に入った曲をローカルストレージに保存して、いつでも聴けるようにすることができます。</p>
      <p>お気に入りに追加するには、曲カードの右下にあるハートアイコンをクリックしてください。もう一度クリックすると、お気に入りから削除できます。</p>
      <p>お気に入りはお使いのブラウザに保存されるため、アカウント登録は不要です。ただし、ブラウザのデータをクリアすると失われる可能性があります。</p>
    </div>
  </section>
</div>
