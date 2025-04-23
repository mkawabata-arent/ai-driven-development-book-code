import type { SongWithArtist } from '$lib/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 曲情報を取得する関数
 * @param songIds 取得したい曲のID（複数指定可）
 * @param artistId 特定のアーティストの曲のみを取得する場合のアーティストID
 * @returns アーティスト情報を含む曲データの配列
 */
export async function listSong(songIds?: number[], artistId?: number): Promise<SongWithArtist[]> {
  // 優先度: songIds > artistId > すべての曲
  
  // 特定の曲IDが指定された場合
  if (songIds && songIds.length > 0) {
    const songs = await prisma.song.findMany({
      where: {
        id: {
          in: songIds
        }
      },
      include: {
        artist: true
      }
    });
    return songs;
  }
  
  // 特定のアーティストの曲が指定された場合
  if (artistId) {
    const songs = await prisma.song.findMany({
      where: {
        artistId: artistId
      },
      include: {
        artist: true
      }
    });
    return songs;
  }
  
  // どちらも指定されていない場合は全ての曲を取得
  const songs = await prisma.song.findMany({
    include: {
      artist: true
    }
  });
  
  return songs;
}
