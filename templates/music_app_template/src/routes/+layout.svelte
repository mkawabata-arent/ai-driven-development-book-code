<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import PlayerWidget from '$lib/components/PlayerWidget.svelte';
</script>

<div class="min-h-screen flex flex-col bg-gray-700">
  <Header />

  <main class="flex-grow">
    <slot />
  </main>

  <PlayerWidget />
</div>