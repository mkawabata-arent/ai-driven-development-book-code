import { writable, readable, derived } from 'svelte/store';
import type { SongWithArtist } from '$lib/type';

// 再生状態を管理するストア
export const isPlaying = writable<boolean>(false);

// 現在再生中の曲を管理するストア
export const currentSong = writable<SongWithArtist | null>(null);

// 現在のオーディオオブジェクトを管理するストア
export const currentAudio = writable<HTMLAudioElement | null>(null);

// 曲の長さを管理するストア
export const audioDuration = writable<number>(0);

// 現在の音量を管理するストア (0.0 〜 1.0)
export const currentVolume = writable<number>(0.7);

// 再生時間を管理するリーダブルストア
export const playbackTime = readable<number>(0, (set) => {
  let interval: number | undefined;
  
  // 購読があるときの初期化処理
  const unsubscribeIsPlaying = isPlaying.subscribe((playing) => {
    if (playing) {
      // 再生中なら100msごとに時間を更新
      interval = window.setInterval(() => {
        currentAudio.subscribe((audio) => {
          if (audio) {
            set(audio.currentTime);
          }
        })();
      }, 100);
    } else {
      // 再生していないならインターバルをクリア
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }
  });
  
  // 購読が終了したときのクリーンアップ処理
  return () => {
    unsubscribeIsPlaying();
    if (interval) {
      clearInterval(interval);
    }
  };
});

/**
 * 指定された曲を再生する
 * @param song 再生する曲のオブジェクト
 */
export function playSong(song: SongWithArtist): void {
  try {
    // 現在のオーディオとステータスを取得
    let audio: HTMLAudioElement | null = null;
    let current: SongWithArtist | null = null;
    let volume = 0.7;
    
    currentAudio.subscribe(value => { audio = value; })();
    currentSong.subscribe(value => { current = value; })();
    currentVolume.subscribe(value => { volume = value; })();
    
    // 同じ曲か確認
    const isSameSong = current && song.id === current.id;
    
    // 既に同じ曲を再生中で一時停止中の場合は再開
    if (isSameSong && audio && audio.paused) {
      audio.play()
        .then(() => {
          isPlaying.set(true);
        })
        .catch(error => {
          console.error('曲の再生中にエラーが発生しました:', error);
        });
      return;
    }
    
    // 別の曲、または初めての再生の場合
    // 既存のオーディオがあれば停止して解放
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    
    // 新しいオーディオを作成
    const newAudio = new Audio();
    
    // オーディオのURLを設定
    const audioUrl = song.audioUrl || song.audio;
    if (!audioUrl) {
      throw new Error(`曲 "${song.title}" のオーディオURLが見つかりません`);
    }
    
    newAudio.src = audioUrl;
    newAudio.volume = volume;
    
    // メタデータが読み込まれたときに長さを設定
    newAudio.onloadedmetadata = () => {
      audioDuration.set(newAudio.duration);
    };
    
    // 再生が終了したときに状態を更新
    newAudio.onended = () => {
      isPlaying.set(false);
    };
    
    // エラーハンドリング
    newAudio.onerror = (error) => {
      console.error('オーディオの読み込み中にエラーが発生しました:', error);
      isPlaying.set(false);
      
      // 曲の再生回数を増やす更新を行わない（エラーのため）
    };
    
    // 再生開始
    newAudio.play()
      .then(() => {
        currentAudio.set(newAudio);
        currentSong.set(song);
        isPlaying.set(true);
      })
      .catch(error => {
        console.error('曲の再生中にエラーが発生しました:', error);
      });
      
  } catch (error) {
    console.error('playSong関数でエラーが発生しました:', error);
  }
}

/**
 * 現在再生中の曲を停止する
 */
export function stopSong(): void {
  try {
    let audio: HTMLAudioElement | null = null;
    currentAudio.subscribe(value => { audio = value; })();
    
    if (audio) {
      audio.pause();
      isPlaying.set(false);
    }
  } catch (error) {
    console.error('stopSong関数でエラーが発生しました:', error);
  }
}

/**
 * 音量を設定する
 * @param volume 設定する音量 (0.0～1.0)
 */
export function setVolume(volume: number): void {
  try {
    // 音量は0～1の範囲に収める
    const normalizedVolume = Math.min(Math.max(volume, 0), 1);
    currentVolume.set(normalizedVolume);
    
    // 現在のオーディオがあれば音量を設定
    let audio: HTMLAudioElement | null = null;
    currentAudio.subscribe(value => { audio = value; })();
    
    if (audio) {
      audio.volume = normalizedVolume;
    }
  } catch (error) {
    console.error('setVolume関数でエラーが発生しました:', error);
  }
}

/**
 * 現在の再生位置を取得する
 * @returns 現在の再生位置（秒）
 */
export function getCurrentPosition(): number {
  let position = 0;
  let audio: HTMLAudioElement | null = null;
  
  currentAudio.subscribe(value => { audio = value; })();
  
  if (audio) {
    position = audio.currentTime;
  }
  
  return position;
}

/**
 * 総再生時間を取得する
 * @returns 曲の総再生時間（秒）
 */
export function getTotalDuration(): number {
  let duration = 0;
  
  audioDuration.subscribe(value => { duration = value; })();
  
  return duration;
}

/**
 * 特定の位置へ移動する
 * @param position 移動先の位置（秒）
 */
export function seekTo(position: number): void {
  try {
    let audio: HTMLAudioElement | null = null;
    let duration = 0;
    
    currentAudio.subscribe(value => { audio = value; })();
    audioDuration.subscribe(value => { duration = value; })();
    
    if (audio && duration > 0) {
      // 0～総再生時間の範囲に収める
      const normalizedPosition = Math.min(Math.max(position, 0), duration);
      audio.currentTime = normalizedPosition;
    }
  } catch (error) {
    console.error('seekTo関数でエラーが発生しました:', error);
  }
}

/**
 * 時間を分:秒形式にフォーマットする
 * @param seconds 秒数
 * @returns MM:SS形式の文字列
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
