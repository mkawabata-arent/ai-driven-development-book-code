<script>
  // ゲームの状態を管理
  import { onMount } from 'svelte';

  // ボードのサイズを定義（8x8）
  const BOARD_SIZE = 8;
  
  // プレイヤーを定義
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;
  
  // 方向を定義（8方向: 上、右上、右、右下、下、左下、左、左上）
  const DIRECTIONS = [
    { row: -1, col: 0 },  // 上
    { row: -1, col: 1 },  // 右上
    { row: 0, col: 1 },   // 右
    { row: 1, col: 1 },   // 右下
    { row: 1, col: 0 },   // 下
    { row: 1, col: -1 },  // 左下
    { row: 0, col: -1 },  // 左
    { row: -1, col: -1 }, // 左上
  ];
  
  // ゲームボードの初期状態を作成
  let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
  
  // 現在のターン（黒が先手）
  let currentPlayer = BLACK;
  
  // 黒と白の駒数
  let blackCount = 2;
  let whiteCount = 2;
  
  // パスの回数を追跡
  let passCount = 0;
  
  // ゲーム終了フラグ
  let gameOver = false;
  
  // 勝者
  let winner = null;
  
  // メッセージ
  let message = '黒の番です';
  
  // ボードの初期化関数
  function initializeBoard() {
    // ボードをリセット
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    
    // 初期配置（中央の4マス）
    const mid = BOARD_SIZE / 2;
    board[mid - 1][mid - 1] = WHITE;
    board[mid - 1][mid] = BLACK;
    board[mid][mid - 1] = BLACK;
    board[mid][mid] = WHITE;
    
    // ゲーム状態をリセット
    currentPlayer = BLACK;
    blackCount = 2;
    whiteCount = 2;
    passCount = 0;
    gameOver = false;
    winner = null;
    message = '黒の番です';
    
    // 有効な手を計算
    calculateValidMoves();
  }
  
  // 有効な手のリスト
  let validMoves = [];
  
  // 有効な手を計算する関数
  function calculateValidMoves() {
    validMoves = [];
    
    // ボード全体をチェック
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // 空のセルのみチェック
        if (board[row][col] !== EMPTY) continue;
        
        // この位置が有効な手かどうかチェック
        const flips = getFlips(row, col, currentPlayer);
        
        // 反転できる駒があれば有効な手
        if (flips.length > 0) {
          validMoves.push({ row, col });
        }
      }
    }
    
    // 有効な手がない場合
    if (validMoves.length === 0) {
      handlePass();
    }
  }
  
  // 反転する駒を取得する関数
  function getFlips(row, col, player) {
    const opponent = player === BLACK ? WHITE : BLACK;
    const flips = [];
    
    // 8方向をチェック
    for (const dir of DIRECTIONS) {
      const dirFlips = [];
      let r = row + dir.row;
      let c = col + dir.col;
      
      // 相手の駒が続く限りチェック
      while (
        r >= 0 && r < BOARD_SIZE && 
        c >= 0 && c < BOARD_SIZE && 
        board[r][c] === opponent
      ) {
        dirFlips.push({ row: r, col: c });
        r += dir.row;
        c += dir.col;
      }
      
      // 方向の終点が自分の駒であれば反転可能
      if (
        r >= 0 && r < BOARD_SIZE && 
        c >= 0 && c < BOARD_SIZE && 
        board[r][c] === player && 
        dirFlips.length > 0
      ) {
        flips.push(...dirFlips);
      }
    }
    
    return flips;
  }
  
  // 駒を置く関数
  function placePiece(row, col) {
    // ゲーム終了時は何もしない
    if (gameOver) return;
    
    // 有効な手かどうかチェック
    const flips = getFlips(row, col, currentPlayer);
    if (flips.length === 0) return;
    
    // 駒を置く
    board[row][col] = currentPlayer;
    
    // 反転する
    for (const flip of flips) {
      board[flip.row][flip.col] = currentPlayer;
    }
    
    // 駒数を更新
    updateCounts();
    
    // ターンを切り替え
    switchTurn();
    
    // パスカウンターをリセット
    passCount = 0;
  }
  
  // 駒数を更新する関数
  function updateCounts() {
    blackCount = 0;
    whiteCount = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === BLACK) blackCount++;
        if (board[row][col] === WHITE) whiteCount++;
      }
    }
  }
  
  // ターンを切り替える関数
  function switchTurn() {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    const playerName = currentPlayer === BLACK ? '黒' : '白';
    message = `${playerName}の番です`;
    
    // 新しいプレイヤーの有効な手を計算
    calculateValidMoves();
    
    // ゲーム終了チェック
    checkGameOver();
  }
  
  // パスを処理する関数
  function handlePass() {
    passCount++;
    
    if (passCount >= 2) {
      // 両プレイヤーが連続してパス → ゲーム終了
      endGame();
    } else {
      // 次のプレイヤーへ
      const playerName = currentPlayer === BLACK ? '黒' : '白';
      message = `${playerName}はパスします`;
      
      // 短い遅延後にターンを切り替え
      setTimeout(() => {
        switchTurn();
      }, 1000);
    }
  }
  
  // 手動パスボタン
  function manualPass() {
    if (gameOver || validMoves.length > 0) return;
    handlePass();
  }
  
  // ゲーム終了条件をチェックする関数
  function checkGameOver() {
    // ボードが埋まった場合
    if (blackCount + whiteCount === BOARD_SIZE * BOARD_SIZE) {
      endGame();
      return;
    }
    
    // どちらかの駒がなくなった場合
    if (blackCount === 0 || whiteCount === 0) {
      endGame();
      return;
    }
  }
  
  // ゲームを終了する関数
  function endGame() {
    gameOver = true;
    
    if (blackCount > whiteCount) {
      winner = BLACK;
      message = '黒の勝ちです！';
    } else if (whiteCount > blackCount) {
      winner = WHITE;
      message = '白の勝ちです！';
    } else {
      winner = null;
      message = '引き分けです！';
    }
  }
  
  // マウントされたときにボードを初期化
  onMount(() => {
    initializeBoard();
  });
  
  // 駒の色を取得するヘルパー関数
  function getPieceClass(value) {
    if (value === BLACK) return 'black';
    if (value === WHITE) return 'white';
    return '';
  }
  
  // 有効な手かどうかをチェック
  function isValidMove(row, col) {
    return validMoves.some(move => move.row === row && move.col === col);
  }
</script>

<main>
  <div class="game-container">
    <h1>オセロゲーム</h1>
    
    <div class="info-container">
      <div class="score-container">
        <div class="score black">
          <div class="piece black"></div>
          <span>{blackCount}</span>
        </div>
        <div class="score white">
          <div class="piece white"></div>
          <span>{whiteCount}</span>
        </div>
      </div>
      
      <div class="message">
        {message}
      </div>
    </div>
    
    <div class="board">
      {#each Array(BOARD_SIZE) as _, rowIndex}
        <div class="row">
          {#each Array(BOARD_SIZE) as _, colIndex}
            <div 
              class="cell {isValidMove(rowIndex, colIndex) ? 'valid-move' : ''}" 
              on:click={() => placePiece(rowIndex, colIndex)}
            >
              {#if board[rowIndex][colIndex] !== EMPTY}
                <div class="piece {getPieceClass(board[rowIndex][colIndex])}"></div>
              {/if}
              {#if isValidMove(rowIndex, colIndex) && !gameOver}
                <div class="hint"></div>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
    
    <div class="controls">
      <button on:click={initializeBoard}>ゲームをリセット</button>
      <button on:click={manualPass} disabled={gameOver || validMoves.length > 0}>パス</button>
    </div>
  </div>
</main>

<style>
  :global(body) {
    font-family: sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
  }
  
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 100%;
  }
  
  h1 {
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .score-container {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 10px;
  }
  
  .score {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .message {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    height: 24px;
    margin: 10px 0;
  }
  
  .board {
    display: flex;
    flex-direction: column;
    border: 2px solid #333;
    background-color: #1a6336;
    margin-bottom: 20px;
  }
  
  .row {
    display: flex;
  }
  
  .cell {
    width: 50px;
    height: 50px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
  }
  
  .piece {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .piece.black {
    background-color: #111;
  }
  
  .piece.white {
    background-color: #fff;
  }
  
  .hint {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
  }
  
  .valid-move:hover {
    background-color: rgba(255, 255, 0, 0.2);
  }
  
  .controls {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #555;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 500px) {
    .cell {
      width: 40px;
      height: 40px;
    }
    
    .piece {
      width: 32px;
      height: 32px;
    }
  }
</style>
