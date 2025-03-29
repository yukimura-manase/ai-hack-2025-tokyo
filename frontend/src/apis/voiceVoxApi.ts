import { VOICE_VOX_URL } from "@/constants/env";

export class VoiceVoxApi {
  private constructor() {}

  /**
   * テキストから音声を生成する
   */
  static async synthesizeSpeech(text: string): Promise<Blob> {
    // 音声合成用のクエリを作成
    const queryResponse = await fetch(
      `${VOICE_VOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const audioQuery = await queryResponse.json();
    console.log("audioQuery", audioQuery);

    // 音声を合成
    const synthesisResponse = await fetch(
      `${VOICE_VOX_URL}/synthesis?speaker=1&enable_interrogative_upspeak=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(audioQuery),
      }
    );

    console.log("synthesisResponse", synthesisResponse);

    return new Blob([await synthesisResponse.arrayBuffer()], {
      type: "audio/wav",
    });
  }
}
