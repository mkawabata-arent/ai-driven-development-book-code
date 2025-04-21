<script lang="ts">
  import type { ArtistWithSongs } from '$lib/type';
  
  // アーティストデータをプロパティとして受け取る（デフォルト値を設定）
  export let artist: ArtistWithSongs = {
    id: 0,
    name: 'アーティスト名不明',
    profile: 'プロフィール情報なし',
    imageUrl: '/img/artist_default.webp',
    createdAt: new Date(),
    updatedAt: new Date(),
    songs: []
  };
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
  <!-- 上部：アーティスト画像 -->
  <div class="aspect-square overflow-hidden">
    <img 
      src={artist.imageUrl || '/img/artist_default.webp'} 
      alt="{artist.name}の画像" 
      class="w-full h-full object-cover"
    />
  </div>
  
  <!-- 下部：アーティスト情報 -->
  <div class="p-4 text-center">
    <a 
      href="/artists/{artist.id}" 
      class="text-xl font-bold text-white hover:text-gray-300 transition-colors"
    >
      {artist.name}
    </a>
    
    <!-- 曲数の表示（オプション） -->
    <p class="text-sm text-gray-400 mt-1">
      {artist.songs.length} 曲
    </p>
  </div>
</div>
