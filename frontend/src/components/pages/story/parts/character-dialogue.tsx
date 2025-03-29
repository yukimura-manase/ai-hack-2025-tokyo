import { useState, useEffect } from "react";
import { Avatar } from "@/components/shared/ui-elements/avatar";
import { cn } from "@/libs/utils";

interface CharacterDialogueProps {
  character: string;
  avatar: string;
  text: string;
  emotion?: "happy" | "sad" | "angry" | "surprised" | "neutral" | "excited";
  isTyping?: boolean;
}

export default function CharacterDialogue({
  character,
  avatar,
  text,
  emotion = "neutral",
  isTyping = false,
}: CharacterDialogueProps) {
  const [displayText, setDisplayText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  // Reset and start typing animation when text changes
  useEffect(() => {
    if (isTyping) {
      setDisplayText("");
      setTypingComplete(false);
      return;
    }

    let index = 0;
    setDisplayText("");

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 30); // Adjust speed of typing here

    return () => clearInterval(typingInterval);
  }, [text, isTyping]);

  // Get emotion color
  const getEmotionColor = () => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 border-green-300";
      case "sad":
        return "bg-blue-100 border-blue-300";
      case "angry":
        return "bg-red-100 border-red-300";
      case "surprised":
        return "bg-yellow-100 border-yellow-300";
      case "excited":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-2 border-gray-300">
          <img
            src={avatar || "/placeholder.svg"}
            alt={character}
            className="object-cover"
          />
        </Avatar>
        <div className="mt-2 font-bold text-center">{character}</div>
      </div>

      <div
        className={cn(
          "flex-1 p-4 rounded-lg border-2 relative",
          getEmotionColor()
        )}
      >
        {/* Triangle pointer */}
        <div
          className="absolute left-[-10px] top-6 w-0 h-0 
          border-t-[10px] border-t-transparent 
          border-r-[10px] border-r-gray-300
          border-b-[10px] border-b-transparent"
        />

        <div className="min-h-[80px]">
          {displayText}
          {!typingComplete && <span className="animate-pulse">|</span>}
        </div>
      </div>
    </div>
  );
}
