<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { ArtistWithSongs, SongWithArtist } from '$lib/type';

  // APIから取得したアーティストデータを格納する変数
  let artists: ArtistWithSongs[] = [];
  let loadingArtists = true;
  let artistsError: string | null = null;

  // APIから取得した曲データを格納する変数
  let songs: SongWithArtist[] = [];
  let loadingSongs = true;
  let songsError: string | null = null;

  // APIからアーティスト情報を取得する関数
  async function fetchArtists() {
    loadingArtists = true;
    artistsError = null;
    
    try {
      const response = await fetch('/api/artists');
      
      if (!response.ok) {
        throw new Error('アーティスト情報の取得に失敗しました');
      }
      
      const data = await response.json();
      artists = data;
    } catch (error) {
      console.error('アーティスト情報の取得エラー:', error);
      artistsError = error instanceof Error ? error.message : 'アーティスト情報の取得中にエラーが発生しました';
    } finally {
      loadingArtists = false;
    }
  }

  // APIから曲情報を取得する関数
  async function fetchSongs() {
    loadingSongs = true;
    songsError = null;
    
    try {
      const response = await fetch('/api/songs');
      
      if (!response.ok) {
        throw new Error('曲情報の取得に失敗しました');
      }
      
      const data = await response.json();
      songs = data;
    } catch (error) {
      console.error('曲情報の取得エラー:', error);
      songsError = error instanceof Error ? error.message : '曲情報の取得中にエラーが発生しました';
    } finally {
      loadingSongs = false;
    }
  }

  // ページ読み込み時にデータを取得
  onMount(() => {
    fetchArtists();
    fetchSongs();
  });
</script>

<div class="container mx-auto px-4 py-8 text-gray-100">
  <!-- 注目のアーティストセクション -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold text-white mb-6">注目のアーティスト</h2>
    
    {#if loadingArtists}
      <div class="flex justify-center items-center p-8">
        <div class="text-white">読み込み中...</div>
      </div>
    {:else if artistsError}
      <div class="bg-red-600 text-white p-4 rounded mb-4">
        <p>{artistsError}</p>
        <button 
          class="mt-2 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
          on:click={fetchArtists}
        >
          再読み込み
        </button>
      </div>
    {:else if artists.length === 0}
      <div class="text-center p-8 bg-gray-800 rounded">
        <p>アーティストが見つかりませんでした</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each artists as artist}
          <div class="flex justify-center">
            <ArtistCard {artist} />
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- 人気の曲セクション -->
  <section>
    <h2 class="text-3xl font-bold text-white mb-6">人気の曲</h2>
    
    {#if loadingSongs}
      <div class="flex justify-center items-center p-8">
        <div class="text-white">読み込み中...</div>
      </div>
    {:else if songsError}
      <div class="bg-red-600 text-white p-4 rounded mb-4">
        <p>{songsError}</p>
        <button 
          class="mt-2 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
          on:click={fetchSongs}
        >
          再読み込み
        </button>
      </div>
    {:else if songs.length === 0}
      <div class="text-center p-8 bg-gray-800 rounded">
        <p>曲が見つかりませんでした</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each songs as song}
          <div class="flex justify-center">
            <SongCard {song} />
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
