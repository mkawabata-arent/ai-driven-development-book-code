<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import type { ArtistWithSongs, SongWithArtist } from '$lib/type';
  import { page } from '$app/stores';

  // URLからアーティストIDを取得
  const artistId = Number($page.params.id);

  // アーティストと曲の状態管理
  let artist: ArtistWithSongs | null = null;
  let songs: SongWithArtist[] = [];

  // ローディングとエラー状態
  let loadingArtist = true;
  let loadingSongs = true;
  let artistError: string | null = null;
  let songsError: string | null = null;

  // アーティスト情報を取得
  async function fetchArtistData() {
    loadingArtist = true;
    artistError = null;
    
    try {
      const response = await fetch(`/api/artists?id=${artistId}`);
      
      if (!response.ok) {
        throw new Error('アーティスト情報の取得に失敗しました');
      }
      
      const data = await response.json();
      if (data.length > 0) {
        artist = data[0];
      } else {
        throw new Error('アーティストが見つかりませんでした');
      }
    } catch (error) {
      console.error('アーティスト情報の取得エラー:', error);
      artistError = error instanceof Error ? error.message : 'アーティスト情報の取得中にエラーが発生しました';
    } finally {
      loadingArtist = false;
    }
  }

  // アーティストの曲を取得
  async function fetchArtistSongs() {
    loadingSongs = true;
    songsError = null;
    
    try {
      const response = await fetch(`/api/songs?artistId=${artistId}`);
      
      if (!response.ok) {
        throw new Error('曲情報の取得に失敗しました');
      }
      
      songs = await response.json();
    } catch (error) {
      console.error('曲情報の取得エラー:', error);
      songsError = error instanceof Error ? error.message : '曲情報の取得中にエラーが発生しました';
    } finally {
      loadingSongs = false;
    }
  }

  // データの再取得
  function refreshData() {
    fetchArtistData();
    fetchArtistSongs();
  }

  // コンポーネントのマウント時にデータを取得
  onMount(refreshData);
</script>

<svelte:head>
  <title>{artist ? `${artist.name} | 音楽アプリ` : '読み込み中... | 音楽アプリ'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 text-gray-100">
  <!-- アーティスト情報セクション -->
  {#if loadingArtist}
    <div class="flex justify-center items-center py-12">
      <div class="text-white text-xl">アーティスト情報を読み込み中...</div>
    </div>
  {:else if artistError}
    <div class="bg-red-600 text-white p-6 rounded-lg mb-8">
      <h2 class="text-xl font-bold mb-2">エラーが発生しました</h2>
      <p>{artistError}</p>
      <button 
        class="mt-4 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
        on:click={fetchArtistData}
      >
        再読み込み
      </button>
    </div>
  {:else if artist}
    <section class="mb-12 bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6">
      <div class="flex flex-col md:flex-row">
        <!-- 左側：アーティスト画像 -->
        <div class="md:w-1/3 mb-6 md:mb-0 md:pr-6">
          <img 
            src={artist.imageUrl || artist.image || 'https://placehold.jp/300x300.png?text=NO%20IMAGE'} 
            alt={`${artist.name}の画像`} 
            class="w-full rounded-lg shadow-md"
          />
        </div>
        
        <!-- 右側：アーティスト名とプロフィール -->
        <div class="md:w-2/3">
          <h1 class="text-4xl font-bold text-white mb-4">{artist.name}</h1>
          <div class="h-1 w-24 bg-white mb-6"></div>
          <p class="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {artist.profile || 'プロフィール情報がありません'}
          </p>
        </div>
      </div>
    </section>
  {/if}

  <!-- 曲一覧セクション -->
  <section>
    <h2 class="text-3xl font-bold text-white mb-6">曲一覧</h2>
    
    {#if loadingSongs}
      <div class="flex justify-center items-center py-8">
        <div class="text-white">曲情報を読み込み中...</div>
      </div>
    {:else if songsError}
      <div class="bg-red-600 text-white p-4 rounded mb-6">
        <p>{songsError}</p>
        <button 
          class="mt-2 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
          on:click={fetchArtistSongs}
        >
          再読み込み
        </button>
      </div>
    {:else if songs.length === 0}
      <div class="bg-gray-800 p-8 rounded-lg text-center">
        <p class="text-gray-300 text-lg">このアーティストの曲は登録されていません</p>
      </div>
    {:else}
      <div class="overflow-x-auto pb-4">
        <div class="flex space-x-6 min-w-max">
          {#each songs as song}
            <SongCard {song} />
          {/each}
        </div>
      </div>
    {/if}
  </section>
</div>
