<script>
  // ナビゲーションメニュー項目の定義
  const navItems = [
    { label: 'ホーム', path: '/' },
    { label: 'お気に入り', path: '/favorite' }
  ];
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
  <div class="container mx-auto flex items-center justify-between">
    <!-- ロゴ - クリックするとトップページへ -->
    <a href="/" class="text-2xl font-bold hover:text-gray-300 transition-colors">
      🚀
    </a>

    <!-- グローバルナビゲーションメニュー -->
    <nav>
      <ul class="flex space-x-6">
        {#each navItems as item}
          <li>
            <a 
              href={item.path} 
              class="hover:text-gray-300 transition-colors"
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>
