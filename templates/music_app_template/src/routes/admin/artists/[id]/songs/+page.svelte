<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';

  // アーティストIDをURLパラメータから取得
  const artistId = $page.params.id;
  
  // アーティスト情報と曲一覧の状態
  let artist = null;
  let songs = [];
  let loading = true;
  let error = null;
  
  // モーダルの状態
  let showModal = false;
  // 曲編集モーダルの状態
  let showEditModal = false;
  
  // フォームの状態
  let title = '';
  let audioFile = null;
  let imageFile = null;
  let submitting = false;
  let submitError = null;
  let submitSuccess = false;
  
  // 編集フォームの状態
  let editSongId = null;
  let editTitle = '';
  let editAudioFile = null;
  let editImageFile = null;
  let editSubmitting = false;
  let editSubmitError = null;
  let editSubmitSuccess = false;
  
  // 再生中の曲のID
  let currentlyPlayingId = null;
  
  // データを取得
  async function fetchData() {
    loading = true;
    error = null;
    
    try {
      // アーティスト情報を取得
      const artistResponse = await fetch(`/api/artists?id=${artistId}`);
      if (!artistResponse.ok) {
        throw new Error('アーティスト情報の取得に失敗しました');
      }
      const artistData = await artistResponse.json();
      if (artistData.length > 0) {
        artist = artistData[0];
      } else {
        throw new Error('アーティストが見つかりません');
      }
      
      // アーティストの曲一覧を取得
      const songsResponse = await fetch(`/api/songs?artistId=${artistId}`);
      if (!songsResponse.ok) {
        throw new Error('曲の一覧の取得に失敗しました');
      }
      songs = await songsResponse.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  // 初期データ取得
  onMount(fetchData);
  
  // モーダルを開く
  function openModal() {
    showModal = true;
  }
  
  // モーダルを閉じる
  function closeModal() {
    showModal = false;
    resetForm();
  }
  
  // 編集モーダルを開く
  function openEditModal(song) {
    editSongId = song.id;
    editTitle = song.title;
    editAudioFile = null;
    editImageFile = null;
    editSubmitError = null;
    editSubmitSuccess = false;
    showEditModal = true;
  }
  
  // 編集モーダルを閉じる
  function closeEditModal() {
    showEditModal = false;
    resetEditForm();
  }
  
  // フォームをリセット
  function resetForm() {
    title = '';
    audioFile = null;
    imageFile = null;
    submitError = null;
    submitSuccess = false;
  }
  
  // 編集フォームをリセット
  function resetEditForm() {
    editSongId = null;
    editTitle = '';
    editAudioFile = null;
    editImageFile = null;
    editSubmitError = null;
    editSubmitSuccess = false;
  }
  
  // ファイル選択処理
  function handleAudioChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      audioFile = files[0];
    }
  }
  
  function handleImageChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      imageFile = files[0];
    }
  }
  
  // 編集用ファイル選択処理
  function handleEditAudioChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      editAudioFile = files[0];
    }
  }
  
  function handleEditImageChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      editImageFile = files[0];
    }
  }
  
  // 曲を追加する
  async function addSong() {
    submitError = null;
    submitSuccess = false;
    
    // バリデーション
    if (!title) {
      submitError = '曲名を入力してください';
      return;
    }
    
    if (!audioFile) {
      submitError = '音声ファイルを選択してください';
      return;
    }
    
    // FormDataの作成
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artistId', artistId);
    formData.append('audioFile', audioFile);
    
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    submitting = true;
    
    try {
      const response = await fetch('/admin/api/songs', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '曲の追加に失敗しました');
      }
      
      submitSuccess = true;
      
      // 成功したら再取得して表示を更新
      await fetchData();
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      submitError = err.message;
    } finally {
      submitting = false;
    }
  }
  
  // 曲を編集する
  async function updateSong() {
    editSubmitError = null;
    editSubmitSuccess = false;
    
    // バリデーション
    if (!editTitle) {
      editSubmitError = '曲名を入力してください';
      return;
    }
    
    // FormDataの作成
    const formData = new FormData();
    formData.append('id', editSongId);
    formData.append('title', editTitle);
    
    if (editAudioFile) {
      formData.append('audioFile', editAudioFile);
    }
    
    if (editImageFile) {
      formData.append('imageFile', editImageFile);
    }
    
    editSubmitting = true;
    
    try {
      const response = await fetch('/admin/api/songs', {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '曲の更新に失敗しました');
      }
      
      editSubmitSuccess = true;
      
      // 成功したら再取得して表示を更新
      await fetchData();
      
      setTimeout(() => {
        closeEditModal();
      }, 2000);
    } catch (err) {
      editSubmitError = err.message;
    } finally {
      editSubmitting = false;
    }
  }
  
  // 音声の再生・停止を切り替える
  function togglePlay(songId) {
    if (currentlyPlayingId === songId) {
      const audio = document.querySelector(`#audio-${songId}`);
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
        currentlyPlayingId = null;
      }
    } else {
      // 他の曲が再生中なら停止
      if (currentlyPlayingId) {
        const prevAudio = document.querySelector(`#audio-${currentlyPlayingId}`);
        if (prevAudio) {
          prevAudio.pause();
        }
      }
      
      // 新しい曲を再生
      const audio = document.querySelector(`#audio-${songId}`);
      if (audio) {
        audio.play();
        currentlyPlayingId = songId;
      }
    }
  }
  
  // 曲の再生が終了したときの処理
  function handleAudioEnded(songId) {
    if (currentlyPlayingId === songId) {
      currentlyPlayingId = null;
    }
  }
</script>

<svelte:head>
  <title>曲管理 | 管理画面</title>
</svelte:head>

<div class="p-6 bg-gray-800 min-h-screen text-white">
  <div class="max-w-6xl mx-auto">
    <!-- ページタイトル -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">曲管理</h1>
      <button 
        on:click={openModal}
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        新規曲追加
      </button>
    </div>
    
    <!-- アーティスト情報 -->
    {#if loading && !artist}
      <p>読み込み中...</p>
    {:else if error}
      <div class="bg-red-500 text-white p-4 rounded mb-6">
        <p>{error}</p>
      </div>
    {:else if artist}
      <div class="bg-gray-700 p-4 rounded mb-6">
        <h2 class="text-xl font-semibold mb-2">アーティスト情報</h2>
        <div class="flex items-center">
          {#if artist.image}
            <img src={artist.image} alt={artist.name} class="w-16 h-16 rounded object-cover mr-4" />
          {:else}
            <div class="w-16 h-16 bg-gray-600 rounded flex items-center justify-center mr-4">
              <span class="text-3xl">🎵</span>
            </div>
          {/if}
          <div>
            <h3 class="text-lg font-semibold">{artist.name}</h3>
            {#if artist.profile}
              <p class="text-gray-300 text-sm">{artist.profile}</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    
    <!-- 曲一覧テーブル -->
    <div class="bg-gray-700 rounded overflow-hidden mb-6">
      <div class="px-6 py-4 border-b border-gray-600">
        <h2 class="text-xl font-semibold">曲一覧</h2>
      </div>
      
      {#if loading && !songs.length}
        <div class="p-6 text-center">
          <p>読み込み中...</p>
        </div>
      {:else if songs.length === 0}
        <div class="p-6 text-center">
          <p>曲が登録されていません。「新規曲追加」ボタンから曲を追加してください。</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-600">
            <thead class="bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  アートワーク
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  曲名
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  プレビュー
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  再生回数
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-700 divide-y divide-gray-600">
              {#each songs as song (song.id)}
                <tr class="hover:bg-gray-600">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if song.image}
                      <img src={song.image} alt={song.title} class="h-12 w-12 rounded object-cover" />
                    {:else}
                      <div class="h-12 w-12 bg-gray-600 rounded flex items-center justify-center">
                        <span>🎵</span>
                      </div>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium">{song.title}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <button 
                        on:click={() => togglePlay(song.id)} 
                        class="bg-gray-800 hover:bg-gray-900 rounded-full p-2 mr-2"
                      >
                        {#if currentlyPlayingId === song.id}
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        {:else}
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                          </svg>
                        {/if}
                      </button>
                      <audio 
                        id="audio-{song.id}" 
                        src={song.audio} 
                        preload="none"
                        on:ended={() => handleAudioEnded(song.id)} 
                        class="hidden"
                      ></audio>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">{song.playCount}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      on:click={() => openEditModal(song)}
                      class="text-indigo-400 hover:text-indigo-300 bg-gray-800 hover:bg-gray-900 px-3 py-1 rounded"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- 新規曲追加モーダル -->
{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 border border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">新規曲追加</h2>
        <button on:click={closeModal} class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {#if submitSuccess}
        <div class="bg-green-600 text-white p-3 rounded mb-4" transition:fade>
          曲が正常に追加されました。
        </div>
      {/if}
      
      {#if submitError}
        <div class="bg-red-600 text-white p-3 rounded mb-4" transition:fade>
          {submitError}
        </div>
      {/if}
      
      <form on:submit|preventDefault={addSong} class="space-y-4">
        <!-- 曲タイトル -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-300 mb-1">曲名 <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            bind:value={title}
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="曲名を入力"
            required
          />
        </div>
        
        <!-- 音声ファイル -->
        <div>
          <label for="audioFile" class="block text-sm font-medium text-gray-300 mb-1">音声ファイル <span class="text-red-500">*</span></label>
          <input
            type="file"
            id="audioFile"
            on:change={handleAudioChange}
            accept="audio/*"
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {#if audioFile}
            <p class="text-sm text-gray-400 mt-1">選択済み: {audioFile.name}</p>
          {/if}
        </div>
        
        <!-- 画像ファイル（オプション） -->
        <div>
          <label for="imageFile" class="block text-sm font-medium text-gray-300 mb-1">アートワーク画像（任意）</label>
          <input
            type="file"
            id="imageFile"
            on:change={handleImageChange}
            accept="image/*"
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {#if imageFile}
            <p class="text-sm text-gray-400 mt-1">選択済み: {imageFile.name}</p>
          {/if}
        </div>
        
        <!-- 送信ボタン -->
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            on:click={closeModal}
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            disabled={submitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
            disabled={submitting}
          >
            {#if submitting}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            {:else}
              保存
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- 曲編集モーダル -->
{#if showEditModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 border border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">曲の編集</h2>
        <button on:click={closeEditModal} class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {#if editSubmitSuccess}
        <div class="bg-green-600 text-white p-3 rounded mb-4" transition:fade>
          曲が正常に更新されました。
        </div>
      {/if}
      
      {#if editSubmitError}
        <div class="bg-red-600 text-white p-3 rounded mb-4" transition:fade>
          {editSubmitError}
        </div>
      {/if}
      
      <form on:submit|preventDefault={updateSong} class="space-y-4">
        <!-- 曲タイトル -->
        <div>
          <label for="editTitle" class="block text-sm font-medium text-gray-300 mb-1">曲名 <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="editTitle"
            bind:value={editTitle}
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="曲名を入力"
            required
          />
        </div>
        
        <!-- 音声ファイル（オプション） -->
        <div>
          <label for="editAudioFile" class="block text-sm font-medium text-gray-300 mb-1">音声ファイル（変更する場合のみ）</label>
          <input
            type="file"
            id="editAudioFile"
            on:change={handleEditAudioChange}
            accept="audio/*"
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {#if editAudioFile}
            <p class="text-sm text-gray-400 mt-1">選択済み: {editAudioFile.name}</p>
          {/if}
        </div>
        
        <!-- 画像ファイル（オプション） -->
        <div>
          <label for="editImageFile" class="block text-sm font-medium text-gray-300 mb-1">アートワーク画像（変更する場合のみ）</label>
          <input
            type="file"
            id="editImageFile"
            on:change={handleEditImageChange}
            accept="image/*"
            class="bg-gray-700 text-white w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {#if editImageFile}
            <p class="text-sm text-gray-400 mt-1">選択済み: {editImageFile.name}</p>
          {/if}
        </div>
        
        <!-- 送信ボタン -->
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            on:click={closeEditModal}
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            disabled={editSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
            disabled={editSubmitting}
          >
            {#if editSubmitting}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            {:else}
              保存
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
