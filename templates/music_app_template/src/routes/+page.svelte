<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  
  // テスト用のダミー曲データ
  const testSongs = [
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
        profile: '音楽活動10年のベテラン。新しいアルバムを発表予定。',
        imageUrl: '/img/artist_default.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      id: 2,
      title: '素晴らしい世界',
      imageUrl: '/img/song_default.webp',
      audioUrl: '/audio/test2.mp3',
      createdAt: new Date(),
      updatedAt: new Date(),
      artistId: 2,
      artist: {
        id: 2,
        name: 'スーパーアーティスト',
        profile: 'とても人気のあるアーティスト。最新アルバムが大ヒット中。',
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
      id: 4,
      title: '星空のソナタ',
      imageUrl: '/img/song_default.webp',
      audioUrl: '/audio/test4.mp3',
      createdAt: new Date(),
      updatedAt: new Date(),
      artistId: 4,
      artist: {
        id: 4,
        name: 'クラシックマスター',
        profile: '独自のスタイルで人気を集めるアーティスト。',
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
        profile: '都会的なサウンドで注目を集める新世代アーティスト。',
        imageUrl: '/img/artist_default.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    {
      id: 6,
      title: '永遠の約束',
      imageUrl: '/img/song_default.webp',
      audioUrl: '/audio/test6.mp3',
      createdAt: new Date(),
      updatedAt: new Date(),
      artistId: 1,
      artist: {
        id: 1,
        name: 'テストアーティスト1',
        profile: '音楽活動10年のベテラン。新しいアルバムを発表予定。',
        imageUrl: '/img/artist_default.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  ];
  
  // テスト用のアーティストデータ
  const testArtists = [
    {
      id: 1,
      name: 'テストアーティスト1',
      profile: '音楽活動10年のベテラン。新しいアルバムを発表予定。',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date(),
      songs: testSongs.filter(song => song.artistId === 1)
    },
    {
      id: 2,
      name: 'スーパーアーティスト',
      profile: 'とても人気のあるアーティスト。最新アルバムが大ヒット中。',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date(),
      songs: testSongs.filter(song => song.artistId === 2)
    },
    {
      id: 3,
      name: '新人アーティスト',
      profile: 'デビューしたばかりの注目アーティスト。',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date(),
      songs: testSongs.filter(song => song.artistId === 3)
    },
    {
      id: 4,
      name: 'クラシックマスター',
      profile: '独自のスタイルで人気を集めるアーティスト。',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date(),
      songs: testSongs.filter(song => song.artistId === 4)
    },
    {
      id: 5,
      name: 'アーバンサウンド',
      profile: '都会的なサウンドで注目を集める新世代アーティスト。',
      imageUrl: '/img/artist_default.webp',
      createdAt: new Date(),
      updatedAt: new Date(),
      songs: testSongs.filter(song => song.artistId === 5)
    }
  ];
</script>

<div class="container mx-auto px-4 py-8">
  <!-- ページタイトル -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-white mb-4">音楽アプリデモ</h1>
    <p class="text-gray-300 max-w-2xl mx-auto">
      このページはコンポーネントの表示確認用です。SongCardとArtistCardコンポーネントを使用して、曲とアーティストの情報を表示しています。
    </p>
  </div>

  <!-- アーティスト一覧セクション（上部に配置） -->
  <section class="mb-16 bg-gray-800 rounded-lg p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">注目アーティスト</h2>
        <p class="text-gray-300 mt-1">お気に入りのアーティストを見つけましょう</p>
      </div>
      <a href="/artists" class="text-indigo-300 hover:text-indigo-200 transition-colors font-medium">すべて表示 →</a>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {#each testArtists as artist}
        <div class="flex justify-center">
          <ArtistCard {artist} />
        </div>
      {/each}
    </div>
  </section>
  
  <!-- 曲一覧セクション（下部に配置） -->
  <section class="bg-gray-800 rounded-lg p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">人気の曲</h2>
        <p class="text-gray-300 mt-1">今人気の曲をチェックしましょう</p>
      </div>
      <a href="/songs" class="text-indigo-300 hover:text-indigo-200 transition-colors font-medium">すべて表示 →</a>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each testSongs as song}
        <div class="flex justify-center">
          <SongCard {song} />
        </div>
      {/each}
    </div>
  </section>

  <!-- コンポーネント説明セクション -->
  <section class="mt-16 bg-gray-800 rounded-lg p-6 shadow-lg">
    <h2 class="text-2xl font-bold text-white mb-4">コンポーネント情報</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- ArtistCardコンポーネント説明 -->
      <div class="bg-gray-700 rounded-lg p-4">
        <h3 class="text-xl font-bold text-white mb-2">ArtistCardコンポーネント</h3>
        <p class="text-gray-300 mb-3">アーティストの基本情報を表示するカードコンポーネント</p>
        <ul class="list-disc list-inside text-gray-200 space-y-1">
          <li>アーティスト画像を表示</li>
          <li>アーティスト名をリンクとして表示</li>
          <li>アーティストの曲数を表示</li>
          <li>アーティスト詳細ページへのリンク</li>
        </ul>
      </div>
      
      <!-- SongCardコンポーネント説明 -->
      <div class="bg-gray-700 rounded-lg p-4">
        <h3 class="text-xl font-bold text-white mb-2">SongCardコンポーネント</h3>
        <p class="text-gray-300 mb-3">曲の詳細情報とコントロールを含むカードコンポーネント</p>
        <ul class="list-disc list-inside text-gray-200 space-y-1">
          <li>曲のアートワーク表示</li>
          <li>曲名とアーティスト名の表示</li>
          <li>再生/一時停止ボタン</li>
          <li>お気に入り追加/削除ボタン</li>
          <li>アーティスト詳細ページへのリンク</li>
        </ul>
      </div>
    </div>
  </section>
</div>
