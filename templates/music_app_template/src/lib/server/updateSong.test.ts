import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { updateSong } from './updateSong';
import { addArtist } from './addArtist';
import { addSong } from './addSong';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('updateSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  const newTestImageBuffer = Buffer.from('new dummy image content');
  const newTestAudioBuffer = Buffer.from('new dummy audio content');
  let testArtistId: number;
  let testSongId: number;

  beforeAll(async () => {
    // テスト用のディレクトリを作成
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // テスト用のアーティストを作成
    const testImageFile = new File([testImageBuffer], 'test-artist.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    // エラー対策のためにFile.prototype.arrayBufferを上書き
    testImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    const artist = await addArtist('Test Artist for Update', 'This is a test artist for update tests.', testImageFile);
    testArtistId = artist.id;

    // テスト用の曲を作成（更新対象）
    const testAudioFile = new File([testAudioBuffer], 'original-song.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    const testSongImageFile = new File([testImageBuffer], 'original-song-cover.jpg', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    testSongImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    // 曲を追加
    const song = await addSong('Original Song', testArtistId, testAudioFile, testSongImageFile);
    testSongId = song.id;
  });

  afterAll(async () => {
    // テストデータを削除
    // まず曲を削除
    await prisma.song.deleteMany({
      where: { artistId: testArtistId }
    });

    // 次にアーティストを削除
    await prisma.artist.delete({
      where: { id: testArtistId }
    });

    // アップロードされたファイルを削除
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.readdirSync(uploadDir).forEach(file => {
      if (file.startsWith('test') || file.startsWith('original') || file.includes('uuid')) {
        try {
          fs.unlinkSync(path.join(uploadDir, file));
        } catch (error) {
          console.warn(`Could not delete file ${file}:`, error);
        }
      }
    });

    await prisma.$disconnect();
  });

  it('should update a song title only', async () => {
    const updatedSong = await updateSong(testSongId, 'Updated Song Title');

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Updated Song Title');
    // 他のフィールドは変更されていないことを確認
    expect(updatedSong.artistId).toBe(testArtistId);
    expect(updatedSong.audio).toBeDefined();
    expect(updatedSong.image).toBeDefined();
  });

  it('should update a song with new audio file', async () => {
    // 新しい音声ファイルを作成
    const newAudioFile = new File([newTestAudioBuffer], 'updated-song.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    newAudioFile.arrayBuffer = async function() {
      return newTestAudioBuffer.buffer;
    };

    const originalSong = await prisma.song.findUnique({
      where: { id: testSongId }
    });
    const originalAudioPath = originalSong?.audio;

    const updatedSong = await updateSong(testSongId, 'Song with New Audio', newAudioFile);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Song with New Audio');
    expect(updatedSong.audio).not.toBe(originalAudioPath); // 音声ファイルのパスが変更されていること
    expect(updatedSong.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
  });

  it('should update a song with new image file', async () => {
    // 新しい画像ファイルを作成
    const newImageFile = new File([newTestImageBuffer], 'updated-song-cover.jpg', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    newImageFile.arrayBuffer = async function() {
      return newTestImageBuffer.buffer;
    };

    const originalSong = await prisma.song.findUnique({
      where: { id: testSongId }
    });
    const originalImagePath = originalSong?.image;

    const updatedSong = await updateSong(testSongId, 'Song with New Image', undefined, newImageFile);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Song with New Image');
    expect(updatedSong.image).not.toBe(originalImagePath); // 画像ファイルのパスが変更されていること
    expect(updatedSong.image).toMatch(/^\/uploads\/[a-f0-9-]+\.jpg$/);
  });

  it('should update a song with both new audio and image files', async () => {
    // 新しい音声ファイルと画像ファイルを作成
    const newAudioFile = new File([newTestAudioBuffer], 'completely-updated-song.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    const newImageFile = new File([newTestImageBuffer], 'completely-updated-cover.jpg', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    newAudioFile.arrayBuffer = async function() {
      return newTestAudioBuffer.buffer;
    };

    newImageFile.arrayBuffer = async function() {
      return newTestImageBuffer.buffer;
    };

    const originalSong = await prisma.song.findUnique({
      where: { id: testSongId }
    });
    const originalAudioPath = originalSong?.audio;
    const originalImagePath = originalSong?.image;

    const updatedSong = await updateSong(testSongId, 'Completely Updated Song', newAudioFile, newImageFile);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Completely Updated Song');
    expect(updatedSong.audio).not.toBe(originalAudioPath);
    expect(updatedSong.image).not.toBe(originalImagePath);
    expect(updatedSong.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
    expect(updatedSong.image).toMatch(/^\/uploads\/[a-f0-9-]+\.jpg$/);
    expect(updatedSong.artist).toBeDefined();
    expect(updatedSong.artist.name).toBe('Test Artist for Update');
  });
}); 