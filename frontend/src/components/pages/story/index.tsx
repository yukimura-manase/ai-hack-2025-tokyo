import { useState, useEffect } from "react";
import { Button } from "@/components/shared/ui-elements/button";
import CharacterDialogue from "@/components/pages/story/parts/character-dialogue";
import axios from "axios";
import { SERVER_URL } from "@/constants/env";
import { Loading } from "@/components/shared/ui-elements/loading/Loading";

// 斉藤 美咲（さいとう みさき）が告白を実行するタイミング
const lastJudgmentCounter = 9;

export const StoryPage = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        const endpoint = lastSpeaker.includes("斉藤 美咲")
          ? `${SERVER_URL}/api/messages/avatar/make-sakuma` // 斉藤 美咲の後は中村 颯真
          : `${SERVER_URL}/api/messages/avatar/make-hiroin`; // 中村 颯真の後は斉藤 美咲

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentDialogueIndex]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[url('/maturi.jpg')] bg-cover bg-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden position absolute top-0 ">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
          <h1 className="text-xl font-bold">2人の会話</h1>
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
