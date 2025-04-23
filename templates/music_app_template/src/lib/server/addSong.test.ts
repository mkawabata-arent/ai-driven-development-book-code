import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { addSong } from './addSong';
import { addArtist } from './addArtist';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('addSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  let testArtistId: number;

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

    const artist = await addArtist('Test Artist for Songs', 'This is a test artist for song tests.', testImageFile);
    testArtistId = artist.id;
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
      if (file.startsWith('test')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    await prisma.$disconnect();
  });

  it('should add a new song with audio and image to the database', async () => {
    // テスト用の音声ファイルと画像ファイルを作成
    const testAudioFile = new File([testAudioBuffer], 'test-song.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    const testImageFile = new File([testImageBuffer], 'test-song-cover.jpg', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    testImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    // 曲を追加
    const song = await addSong('Test Song', testArtistId, testAudioFile, testImageFile);

    // テスト結果を検証
    expect(song).toBeDefined();
    expect(song.title).toBe('Test Song');
    expect(song.artistId).toBe(testArtistId);
    expect(song.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
    expect(song.image).toMatch(/^\/uploads\/[a-f0-9-]+\.jpg$/);
    expect(song.artist).toBeDefined();
    expect(song.artist.name).toBe('Test Artist for Songs');
  });

  it('should add a new song with audio only (no image) to the database', async () => {
    // テスト用の音声ファイルのみを作成
    const testAudioFile = new File([testAudioBuffer], 'test-song-no-image.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    // arrayBufferメソッドをモック
    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    // 画像なしで曲を追加
    const song = await addSong('Test Song No Image', testArtistId, testAudioFile);

    // テスト結果を検証
    expect(song).toBeDefined();
    expect(song.title).toBe('Test Song No Image');
    expect(song.artistId).toBe(testArtistId);
    expect(song.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
    expect(song.image).toBeNull(); // 画像がないことを確認
    expect(song.artist).toBeDefined();
    expect(song.artist.name).toBe('Test Artist for Songs');
  });
}); 