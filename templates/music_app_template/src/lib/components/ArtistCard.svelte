<script lang="ts">
  import type { ArtistWithSongs } from '$lib/type';

  // artistプロパティを受け取る（ArtistWithSongs型）
  export let artist: ArtistWithSongs;
  
  // 画像URLのフォールバック
  const imageUrl = artist.imageUrl || artist.image || 'https://placehold.jp/300x300.png?text=NO%20IMAGE';
  
  // プロフィールがある場合は最初の30文字を表示
  const shortProfile = artist.profile 
    ? artist.profile.length > 30 
      ? artist.profile.substring(0, 30) + '...' 
      : artist.profile 
    : '';
</script>

<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-64 transform hover:-translate-y-1">
  <!-- アーティスト詳細ページへのリンク（カード全体） -->
  <a href="/artists/{artist.id}" class="block">
    <!-- 上部：アーティスト画像 -->
    <div class="relative">
      <img 
        src={imageUrl} 
        alt={`${artist.name}の画像`} 
        class="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      
      <!-- 画像上にアーティスト名を表示（大きな画面のみ） -->
      <div class="absolute bottom-0 left-0 right-0 p-4 hidden md:block">
        <h3 class="text-white font-bold text-xl truncate">
          {artist.name}
        </h3>
      </div>
    </div>

    <!-- 下部：アーティスト情報 -->
    <div class="p-4">
      <!-- 小さな画面用のアーティスト名 -->
      <h3 class="text-white font-bold text-xl truncate hover:text-gray-300 transition-colors md:hidden">
        {artist.name}
      </h3>
      
      <!-- 曲数 -->
      <p class="text-gray-400 text-sm mt-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
        {artist.songs?.length || 0}曲
      </p>
      
      <!-- プロフィール抜粋（存在する場合のみ） -->
      {#if shortProfile}
        <p class="text-gray-300 text-sm mt-2 line-clamp-2">
          {shortProfile}
        </p>
      {/if}
      
      <!-- 詳細を見るテキスト -->
      <p class="text-blue-400 text-sm mt-2 hover:underline">詳細を見る</p>
    </div>
  </a>
</div>
