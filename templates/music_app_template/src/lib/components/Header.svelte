<script>
  import { page } from '$app/stores';
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-2xl font-bold hover:text-gray-300 transition-colors">🚀</a>
    
    <nav>
      <ul class="flex space-x-6">
        <li>
          <a 
            href="/" 
            class="hover:text-gray-300 transition-colors {$page.url.pathname === '/' ? 'font-bold border-b-2 border-white pb-1' : ''}"
          >
            ホーム
          </a>
        </li>
        <li>
          <a 
            href="/favorite" 
            class="hover:text-gray-300 transition-colors {$page.url.pathname === '/favorite' ? 'font-bold border-b-2 border-white pb-1' : ''}"
          >
            お気に入り
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>
