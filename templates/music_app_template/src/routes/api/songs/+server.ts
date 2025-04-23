import { json } from '@sveltejs/kit';
import { listSong } from '$lib/server/listSong';

/**
 * 曲情報を取得するGETリクエスト処理
 * クエリパラメータ:
 * - id: 取得したい曲のID（カンマ区切りで複数指定可）
 * - artistId: 特定のアーティストの曲のみを取得する場合のアーティストID
 * パラメータがない場合はすべての曲を取得
 */
export async function GET({ url }) {
  // クエリパラメータの取得
  const ids = url.searchParams.get('id');
  const artistIdParam = url.searchParams.get('artistId');
  
  // パラメータの変換と検証
  let songIds: number[] | undefined;
  let artistId: number | undefined;
  
  // 曲IDの処理（カンマ区切りで複数指定可能）
  if (ids) {
    try {
      songIds = ids.split(',').map(id => {
        const parsedId = parseInt(id.trim(), 10);
        if (isNaN(parsedId)) {
          throw new Error(`Invalid song ID: ${id}`);
        }
        return parsedId;
      });
    } catch (error) {
      return json({ error: 'Invalid song ID format. Use comma-separated numbers.' }, { status: 400 });
    }
  }
  
  // アーティストIDの処理
  if (artistIdParam) {
    artistId = parseInt(artistIdParam, 10);
    if (isNaN(artistId)) {
      return json({ error: 'Invalid artist ID' }, { status: 400 });
    }
  }
  
  try {
    // listSong関数を使って曲情報を取得
    const songs = await listSong(songIds, artistId);
    
    return json(songs, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
