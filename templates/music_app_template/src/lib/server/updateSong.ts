import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

/**
 * 曲の情報を更新する
 * @param id - 更新する曲のID
 * @param title - 曲のタイトル
 * @param audioFile - オーディオファイル（オプション）
 * @param imageFile - イメージファイル（オプション）
 * @returns - 更新された曲の情報
 */
export async function updateSong(
  id: number,
  title: string,
  audioFile?: File,
  imageFile?: File
) {
  // 曲の存在確認
  const existingSong = await prisma.song.findUnique({ where: { id } });
  if (!existingSong) {
    throw new Error(`Song with id ${id} not found`);
  }

  // アップロードされたファイルを保存する配列
  const savedFiles: string[] = [];
  let audioPath = existingSong.audio;
  let imagePath = existingSong.image;

  try {
    // アップロードディレクトリの確認
    const uploadDir = path.join(process.cwd(), 'static/uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 音声ファイルの処理
    if (audioFile) {
      // 一意のファイル名を生成
      const fileExt = path.extname(audioFile.name);
      const fileName = `${uuid()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // ファイルの内容をArrayBufferとして取得し、保存
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      // 古いファイルのパスを記録（後で削除するため）
      const oldAudioPath = existingSong.audio;

      // パスを更新
      audioPath = `/uploads/${fileName}`;
      savedFiles.push(filePath);

      // 古いファイルを削除（ファイルが存在する場合のみ）
      if (oldAudioPath && oldAudioPath.startsWith('/uploads/')) {
        try {
          const oldFilePath = path.join(process.cwd(), 'static', oldAudioPath);
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.warn(`Could not delete old audio file: ${err}`);
        }
      }
    }

    // 画像ファイルの処理（提供された場合）
    if (imageFile) {
      // 一意のファイル名を生成
      const fileExt = path.extname(imageFile.name);
      const fileName = `${uuid()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // ファイルの内容をArrayBufferとして取得し、保存
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      // 古いファイルのパスを記録（後で削除するため）
      const oldImagePath = existingSong.image;

      // パスを更新
      imagePath = `/uploads/${fileName}`;
      savedFiles.push(filePath);

      // 古いファイルを削除（ファイルが存在し、アップロードされたものである場合のみ）
      if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
        try {
          const oldFilePath = path.join(process.cwd(), 'static', oldImagePath);
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.warn(`Could not delete old image file: ${err}`);
        }
      }
    }

    // データベースに曲情報を更新
    const updatedSong = await prisma.song.update({
      where: { id },
      data: {
        title,
        audio: audioPath,
        image: imagePath,
      },
      include: {
        artist: true, // 関連するアーティスト情報も取得
      },
    });

    return updatedSong;
  } catch (error) {
    // エラーが発生した場合、保存したファイルを削除
    for (const filePath of savedFiles) {
      try {
        await fs.unlink(filePath);
      } catch (deleteError) {
        console.error(`Failed to delete file ${filePath} after error: ${deleteError}`);
      }
    }
    throw error;
  }
}
