import { json } from '@sveltejs/kit';
import { addSong } from '$lib/server/addSong';
import { updateSong } from '$lib/server/updateSong';

/**
 * 曲を追加するPOSTリクエスト処理
 * 必須パラメータ: title, artistId, audioFile
 * オプションパラメータ: imageFile
 */
export const POST = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const artistId = formData.get('artistId');
    const audioFile = formData.get('audioFile');
    const imageFile = formData.get('imageFile') || undefined;

    // 必須パラメータの検証
    if (!title || !artistId || !audioFile) {
        return json({ 
            error: 'Missing required fields. Title, artist ID, and audio file are required.' 
        }, { status: 400 });
    }

    try {
        // artistIdを数値に変換
        const artistIdNum = Number(artistId);
        if (isNaN(artistIdNum)) {
            return json({ error: 'Artist ID must be a number' }, { status: 400 });
        }

        const song = await addSong(
            title as string, 
            artistIdNum, 
            audioFile as File, 
            imageFile as File | undefined
        );
        
        return json(song, { status: 201 });
    } catch (error) {
        console.error('Failed to add song:', error);
        return json({ error: 'Failed to add song' }, { status: 500 });
    }
};

/**
 * 曲を更新するPUTリクエスト処理
 * 必須パラメータ: id, title
 * オプションパラメータ: audioFile, imageFile
 */
export const PUT = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const audioFile = formData.get('audioFile') || undefined;
    const imageFile = formData.get('imageFile') || undefined;

    // 必須パラメータの検証
    if (!id || !title) {
        return json({ 
            error: 'Missing required fields. Song ID and title are required.' 
        }, { status: 400 });
    }

    try {
        // idを数値に変換
        const idNum = Number(id);
        if (isNaN(idNum)) {
            return json({ error: 'Song ID must be a number' }, { status: 400 });
        }

        const song = await updateSong(
            idNum,
            title as string, 
            audioFile as File | undefined, 
            imageFile as File | undefined
        );
        
        return json(song, { status: 200 });
    } catch (error) {
        console.error('Failed to update song:', error);
        if (error instanceof Error && error.message.includes('not found')) {
            return json({ error: error.message }, { status: 404 });
        }
        return json({ error: 'Failed to update song' }, { status: 500 });
    }
};
