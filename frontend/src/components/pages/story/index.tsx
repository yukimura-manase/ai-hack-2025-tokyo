import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/shared/ui-elements/button";
import CharacterDialogue from "@/components/pages/story/parts/character-dialogue";
import axios from "axios";
import { SERVER_URL } from "@/constants/env";
import { Loading } from "@/components/shared/ui-elements/loading/Loading";
import { VoiceVoxApi } from "@/apis/voiceVoxApi";
import { Volume2, VolumeX } from "lucide-react";
import { useUser } from "@/stores/user";
import { useAuthGuard } from "@/hooks/use-auth-guard";

// 斉藤 美咲（さいとう みさき）が告白を実行するタイミング
const loveAttackCounter = 5;

export const StoryPage = () => {
  // 認証ガードを使用
  useAuthGuard();
  const { user } = useUser();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
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
    if (isMuted) return;

    try {
      console.log("音声生成開始:", text);
      setIsPlaying(true);
      setAudioError(null);

      // 既存の音声を停止
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      // 音声を合成して、Blob を取得する。
      const audioBlob = await VoiceVoxApi.synthesizeSpeech(text);
      if (!audioBlob) {
        throw new Error("音声生成に失敗しました");
      }

      console.log("音声生成完了", audioBlob);

      // Blob を URL に変換する。
      const audioUrl = URL.createObjectURL(audioBlob);

      // audioRefに設定して再生
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onerror = (e) => {
        console.error("音声再生エラー:", e);
        setAudioError("音声の再生中にエラーが発生しました");
        setIsPlaying(false);
      };

      // 音声再生開始
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("音声再生が拒否されました:", error);
          setAudioError("音声の再生が拒否されました");
          setIsPlaying(false);
        });
      }
    } catch (error) {
      console.error("音声生成エラー:", error);
      setAudioError("音声の生成中にエラーが発生しました");
      setIsPlaying(false);
    }
  };

  // 音声再生をトグルする関数
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (isMuted && !isTyping && dialogues[currentDialogueIndex]) {
      // ミュート解除時に現在のダイアログを再生
      playAIResponse(dialogues[currentDialogueIndex].text);
    }
  };

  const handleNext = async () => {
    // 現在再生中の音声を停止
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

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
        if (dialogues.length + 1 === loveAttackCounter) {
          endpoint = `${SERVER_URL}/api/messages/avatar/make-hiroin/love-attack`;
        }

        if (dialogues.length + 1 === loveAttackCounter + 1) {
          endpoint = `${SERVER_URL}/api/messages/avatar/make-sakuma/last-judgment`;
        }

        console.log("endpoint選択状態:", endpoint);

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
              "X-User-Id": user?.userId || "anonymous",
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
    // 現在再生中の音声を停止
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (currentDialogueIndex > 0) {
      setIsTyping(true);
      setCurrentDialogueIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);

      // タイピング効果が終わったら音声を再生（ミュートされていない場合）
      if (dialogues[currentDialogueIndex] && !isMuted) {
        playAIResponse(dialogues[currentDialogueIndex].text);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentDialogueIndex, isMuted]);

  // コンポーネントがアンマウントされたときにオーディオリソースをクリーンアップ
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[url('/maturi.jpg')] bg-cover bg-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden position absolute top-0 ">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">2人の会話</h1>
          <div className="flex items-center gap-2">
            {isPlaying && !isMuted && (
              <span className="text-xs animate-pulse">🔊 再生中...</span>
            )}
            <Button
              onClick={toggleMute}
              variant="ghost"
              className="text-white hover:bg-white/20"
              size="sm"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>
        </div>

        <div className="p-6 min-h-[230px] flex flex-col justify-between">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loading />
            </div>
          ) : (
            <>
              <CharacterDialogue
                character={dialogues[currentDialogueIndex].character}
                avatar={dialogues[currentDialogueIndex].avatar}
                text={dialogues[currentDialogueIndex].text}
                isTyping={isTyping}
              />
              {audioError && (
                <div className="text-red-500 text-sm mt-2">{audioError}</div>
              )}
            </>
          )}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentDialogueIndex === 0 || isLoading || isTyping}
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
                  dialogues.length >= loveAttackCounter + 1) ||
                isLoading ||
                isTyping
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
