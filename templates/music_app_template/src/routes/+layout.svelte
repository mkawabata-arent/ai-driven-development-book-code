<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Player from '$lib/components/Player.svelte';
</script>

<!-- 背景色をHTML全体に適用 -->
<div class="bg-gray-700">
  <div class="min-h-screen flex flex-col text-white">
    <Header />
    <main class="flex-grow container mx-auto p-4 pb-28">
      <slot />
    </main>
    <Player />
  </div>
</div>

<style>
  /* 画面高さいっぱいに背景色を適用し、スクロールしても継続するよう設定 */
  :global(html),
  :global(body) {
    background-color: theme('colors.gray.700');
    min-height: 100%;
    height: 100%;
  }
</style>