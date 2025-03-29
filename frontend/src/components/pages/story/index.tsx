import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/shared/ui-elements/button";
import CharacterDialogue from "@/components/pages/story/parts/character-dialogue";
import axios from "axios";
import { SERVER_URL } from "@/constants/env";
import { Loading } from "@/components/shared/ui-elements/loading/Loading";
import { VoiceVoxApi } from "@/apis/voiceVoxApi";
import { Volume2, VolumeX } from "lucide-react";

// 斉藤 美咲（さいとう みさき）が告白を実行するタイミング
const lastJudgmentCounter = 5;

export const StoryPage = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const misakiAvatar = "/icons/make-hiroin-icon.png";
  const soumaAvatar = "/icons/target-icon2.png";

  /** 2人の会話メッセージBox */
  const [dialogues, setDialogues] = useState([
    {
      character: "斉藤 美咲（さいとう みさき）",
      avatar: misakiAvatar,
      text: "颯真くん、お待たせ！お祭り楽しみ！",
    },
    // 中村 颯真（なかむら そうま）と、斉藤 美咲（さいとう みさき）の会話がリストに追加されていく！
  ]);

  /**
   * AIの応答を音声で再生する
   */
  const playAIResponse = async (text: string) => {
    try {
      console.log("text", text);

      // 音声を合成して、Blob を取得する。
      const audioBlob = await VoiceVoxApi.synthesizeSpeech(text);
      console.log("audioBlob", audioBlob);
      // Blob を URL に変換する。
      const audioUrl = URL.createObjectURL(audioBlob);
      // 音声インスタンス & 再生する。
      const audio = new Audio(audioUrl);
      await audio.play();

      // 再生が終わったらURLを解放
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing AI response:", error);
    }
  };

  // 音声再生をトグルする関数
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = async () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      setIsTyping(true);
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // 最後のメッセージに達した場合、新しいメッセージを取得
      setIsLoading(true);
      try {
        // 会話のリスト
        const messages = dialogues.map(
          (dialogue) => `${dialogue.character}: ${dialogue.text}`
        );

        // 最後の話者
        const lastSpeaker = dialogues[dialogues.length - 1].character;

        // 最後の話者に基づいて、次の話者のエンドポイントを決定
        let endpoint = lastSpeaker.includes("斉藤 美咲")
          ? `${SERVER_URL}/api/messages/avatar/make-sakuma` // 斉藤 美咲の後は中村 颯真
          : `${SERVER_URL}/api/messages/avatar/make-hiroin`; // 中村 颯真の後は斉藤 美咲

        // 会話リストが5回目の場合は、告白メッセージを生成する
        if (dialogues.length === lastJudgmentCounter) {
          endpoint = `${SERVER_URL}/api/messages/avatar/make-hiroin/love-attack`;
        }

        if (dialogues.length === lastJudgmentCounter + 1) {
          endpoint = `${SERVER_URL}/api/messages/avatar/make-sakuma/last-judgment`;
        }

        // 次の話者の情報を設定
        const nextCharacter = lastSpeaker.includes("斉藤 美咲")
          ? "中村 颯真（なかむら そうま）"
          : "斉藤 美咲（さいとう みさき）";

        const nextAvatar = lastSpeaker.includes("斉藤 美咲")
          ? soumaAvatar
          : misakiAvatar;

        // APIリクエスト
        const response = await axios.post(
          endpoint,
          {
            // 会話内容のリストを送る。
            content: [messages],
          },
          {
            headers: {
              "X-User-Id": "anonymous", // 必要に応じてユーザーIDを取得・設定
            },
          }
        );

        // 新しい会話メッセージを追加
        const newDialogue = {
          character: nextCharacter,
          avatar: nextAvatar,
          text: response.data.text,
        };

        setDialogues((prev) => [...prev, newDialogue]);
        setIsTyping(true);
        setCurrentDialogueIndex((prev) => prev + 1);
      } catch (error) {
        console.error("APIの呼び出しに失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentDialogueIndex > 0) {
      setIsTyping(true);
      setCurrentDialogueIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      // タイピング効果が終わったら音声を再生
      if (!isTyping) {
        console.log(
          "dialogues[currentDialogueIndex].text",
          dialogues[currentDialogueIndex].text
        );
        playAIResponse(dialogues[currentDialogueIndex].text);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentDialogueIndex]);

  // コンポーネントがアンマウントされたときにオーディオリソースをクリーンアップ
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[url('/maturi.jpg')] bg-cover bg-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden position absolute top-0 ">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">2人の会話</h1>
          <Button
            onClick={toggleMute}
            variant="ghost"
            className="text-white hover:bg-white/20"
            size="sm"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        <div className="p-6 min-h-[230px] flex flex-col justify-between">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loading />
            </div>
          ) : (
            <CharacterDialogue
              character={dialogues[currentDialogueIndex].character}
              avatar={dialogues[currentDialogueIndex].avatar}
              text={dialogues[currentDialogueIndex].text}
              isTyping={isTyping}
            />
          )}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentDialogueIndex === 0 || isLoading}
              variant="outline"
            >
              前へ
            </Button>
            <div className="text-sm text-gray-500">
              {currentDialogueIndex + 1} / {dialogues.length}
            </div>
            <Button
              onClick={handleNext}
              disabled={
                (currentDialogueIndex === dialogues.length - 1 &&
                  dialogues.length >= lastJudgmentCounter) ||
                isLoading
              }
            >
              次へ
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
