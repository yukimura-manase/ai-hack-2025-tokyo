import { Client } from "voicevox-api-client";
import fs from "fs";

const client = new Client("http://localhost:50021");

const createVoice = async (text) => {
  // 音声合成用のクエリを作成
  const query = await client.query.createQuery(0, text);
  // 音声を生成
  const voice = await client.voice.createVoice(0, query);
  // 音声データからバッファーを作成する
  const buf = Buffer.from(voice);
  // バッファーをファイルに書き出す
  fs.writeFileSync("voice.wav", buf);
};

createVoice("Dockerがどっかーん");
