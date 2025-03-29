import { useState, useEffect } from "react";
import { Button } from "@/components/shared/ui-elements/button";
import CharacterDialogue from "@/components/pages/story/parts/character-dialogue";

export const StoryPage = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const dialogues = [
    {
      character: "斉藤 美咲（さいとう みさき）",
      avatar: "/icons/make-hiroin-icon.png",
      text: "こんにちは！私の名前はミカです。よろしくお願いします！",
    },
    {
      character: "中村 颯真（なかむら そうま）",
      avatar: "/icons/target-icon2.png",
      text: "初めまして、ミカさん。タカシです。今日はいい天気ですね。",
    },
    {
      character: "斉藤 美咲（さいとう みさき）",
      avatar: "/icons/make-hiroin-icon.png",
      text: "そうですね！散歩に行きませんか？",
    },
    {
      character: "中村 颯真（なかむら そうま）",
      avatar: "/icons/target-icon2.png",
      text: "いいですね。行きましょう！",
    },
  ];

  const handleNext = () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      setIsTyping(true);
      setCurrentDialogueIndex((prev) => prev + 1);
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
          <CharacterDialogue
            character={dialogues[currentDialogueIndex].character}
            avatar={dialogues[currentDialogueIndex].avatar}
            text={dialogues[currentDialogueIndex].text}
            isTyping={isTyping}
          />

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentDialogueIndex === 0}
              variant="outline"
            >
              前へ
            </Button>
            <div className="text-sm text-gray-500">
              {currentDialogueIndex + 1} / {dialogues.length}
            </div>
            <Button
              onClick={handleNext}
              disabled={currentDialogueIndex === dialogues.length - 1}
            >
              次へ
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
