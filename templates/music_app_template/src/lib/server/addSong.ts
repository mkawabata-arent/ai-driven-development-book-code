import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, audioFile: File, imageFile?: File) {
  // アップロードディレクトリの設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 音声ファイルの保存処理
  const audioFileName = `${uuidv4()}${path.extname(audioFile.name)}`;
  const audioFilePath = path.join(uploadDir, audioFileName);

  // 音声ファイルをバイナリとして読み込み、保存
  const audioBuffer = await audioFile.arrayBuffer();
  fs.writeFileSync(audioFilePath, Buffer.from(audioBuffer));
  
  // 画像ファイルの保存処理（省略可能）
  let imageFilePath = null;
  if (imageFile) {
    const imageFileName = `${uuidv4()}${path.extname(imageFile.name)}`;
    imageFilePath = path.join(uploadDir, imageFileName);
    
    // 画像ファイルをバイナリとして読み込み、保存
    const imageBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(imageFilePath, Buffer.from(imageBuffer));
    
    // データベースに保存するパスはWebからアクセス可能な形式に変換
    imageFilePath = `/uploads/${imageFileName}`;
  }

  // 曲情報をデータベースに保存
  try {
    const song = await prisma.song.create({
      data: {
        title,
        artistId,
        audio: `/uploads/${audioFileName}`,
        image: imageFilePath,
        playCount: 0 // デフォルト値はスキーマで定義済だが明示的に指定
      },
      include: {
        artist: true // 関連するアーティスト情報も含める
      }
    });

    return song;
  } catch (error) {
    // ファイルは保存されたがデータベース登録に失敗した場合、ファイルを削除
    fs.unlinkSync(path.join(uploadDir, audioFileName));
    if (imageFilePath) {
      fs.unlinkSync(path.join(uploadDir, path.basename(imageFilePath)));
    }
    throw error;
  }
}
