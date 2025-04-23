import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listSong } from './listSong';

const prisma = new PrismaClient();

describe('listSong', () => {
  let artist1Id: number;
  let artist2Id: number;
  let song1Id: number;
  let song2Id: number;
  let song3Id: number;

  beforeAll(async () => {
    // テスト用のアーティスト1と曲を作成
    const artist1 = await prisma.artist.create({
      data: {
        name: 'Test Artist 1',
        profile: 'This is a test artist 1.',
        image: '/uploads/test-artist1.png',
      },
    });

    artist1Id = artist1.id;

    // テスト用のアーティスト2を作成
    const artist2 = await prisma.artist.create({
      data: {
        name: 'Test Artist 2',
        profile: 'This is a test artist 2.',
        image: '/uploads/test-artist2.png',
      },
    });

    artist2Id = artist2.id;

    // アーティスト1の曲を2つ作成
    const song1 = await prisma.song.create({
      data: {
        title: 'Test Song 1',
        image: '/uploads/test-song1.png',
        audio: '/uploads/test-song1.mp3',
        artistId: artist1Id,
      },
    });

    const song2 = await prisma.song.create({
      data: {
        title: 'Test Song 2',
        image: '/uploads/test-song2.png',
        audio: '/uploads/test-song2.mp3',
        artistId: artist1Id,
      },
    });

    // アーティスト2の曲を1つ作成
    const song3 = await prisma.song.create({
      data: {
        title: 'Test Song 3',
        image: '/uploads/test-song3.png',
        audio: '/uploads/test-song3.mp3',
        artistId: artist2Id,
      },
    });

    song1Id = song1.id;
    song2Id = song2.id;
    song3Id = song3.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.deleteMany({
      where: { 
        OR: [
          { artistId: artist1Id },
          { artistId: artist2Id }
        ]
      }
    });

    await prisma.artist.deleteMany({
      where: { 
        id: { 
          in: [artist1Id, artist2Id] 
        } 
      }
    });

    await prisma.$disconnect();
  });

  it('should retrieve all songs when no parameters are provided', async () => {
    const songs = await listSong();

    expect(songs.length).toBeGreaterThanOrEqual(3);
    // テストで作成した3つの曲が含まれているか確認
    const testSongIds = [song1Id, song2Id, song3Id];
    const foundTestSongs = songs.filter(song => testSongIds.includes(song.id));
    expect(foundTestSongs.length).toBe(3);
  });

  it('should retrieve songs by specific song IDs', async () => {
    const songs = await listSong([song1Id, song2Id]);

    expect(songs).toHaveLength(2);
    expect(songs[0].id).toBe(song1Id);
    expect(songs[1].id).toBe(song2Id);
    expect(songs[0].title).toBe('Test Song 1');
    expect(songs[1].title).toBe('Test Song 2');
  });

  it('should retrieve only one song when one song ID is provided', async () => {
    const songs = await listSong([song3Id]);

    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe(song3Id);
    expect(songs[0].title).toBe('Test Song 3');
  });

  it('should retrieve songs by a specific artist ID', async () => {
    const songs = await listSong(undefined, artist1Id);

    expect(songs).toHaveLength(2);
    expect(songs[0].artistId).toBe(artist1Id);
    expect(songs[1].artistId).toBe(artist1Id);
    expect(songs.some(song => song.id === song1Id)).toBe(true);
    expect(songs.some(song => song.id === song2Id)).toBe(true);
  });

  it('should retrieve songs with artist information', async () => {
    const songs = await listSong([song1Id]);

    expect(songs).toHaveLength(1);
    expect(songs[0].artist).toBeDefined();
    expect(songs[0].artist.name).toBe('Test Artist 1');
    expect(songs[0].artist.profile).toBe('This is a test artist 1.');
  });

  it('should return an empty array when non-existent song IDs are provided', async () => {
    const nonExistentId = 9999;
    const songs = await listSong([nonExistentId]);

    expect(songs).toHaveLength(0);
  });

  it('should return an empty array when non-existent artist ID is provided', async () => {
    const nonExistentArtistId = 9999;
    const songs = await listSong(undefined, nonExistentArtistId);

    expect(songs).toHaveLength(0);
  });

  it('should correctly filter when some song IDs exist and some do not', async () => {
    const nonExistentId = 9999;
    const songs = await listSong([song1Id, nonExistentId]);

    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe(song1Id);
  });

  it('should prioritize song IDs over artist ID when both are provided', async () => {
    // artist2Idに属するsong3Idと、artist1Idを指定
    const songs = await listSong([song3Id], artist1Id);

    // songIdsが優先されるので、artist1Idは無視されsong3Idの曲だけが返される
    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe(song3Id);
    expect(songs[0].artistId).toBe(artist2Id);
  });
}); 