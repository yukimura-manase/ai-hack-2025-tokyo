import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FC, useEffect } from "react";
import { Html } from "@react-three/drei";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/shared/ui-elements/card";
import { useUser } from "@/stores/user";
import axios from "axios";
import { VoiceVoxApi } from "@/apis/voiceVoxApi";

// チャットメッセージの型定義
interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "avatar";
  timestamp: Date;
  emotion?: "neutral" | "happy" | "sad" | "surprised" | "angry";
}

// アバターの感情の型定義
type AvatarEmotion = "neutral" | "happy" | "sad" | "surprised" | "angry";

// APIレスポンスの型定義
interface AvatarChatResponse {
  text: string;
  emotion: AvatarEmotion;
  timestamp: Date;
}

interface MakeinAvatarProps {
  url: string;
}

export const MakeinAvatar = ({ url }: MakeinAvatarProps) => {
  const gltfCanvasParentRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "こんにちは！どうしたの？",
      sender: "avatar",
      timestamp: new Date(),
      emotion: "happy",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentEmotion, setCurrentEmotion] =
    useState<AvatarEmotion>("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3777";

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

  // メッセージ送信ハンドラー
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    setIsLoading(true);

    // ユーザーメッセージの追加
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      // APIを使用してAI応答と感情分析を取得
      const response = await axios.post<AvatarChatResponse>(
        `${serverUrl}/api/messages/avatar/chat`,
        { content: inputMessage }
      );

      // APIからのレスポンスを使用してアバターの感情を設定
      const avatarEmotion = response.data.emotion;
      setCurrentEmotion(avatarEmotion);

      // アバターの応答を追加
      const avatarResponse: ChatMessage = {
        id: messages.length + 2,
        text: response.data.text,
        sender: "avatar",
        timestamp: new Date(response.data.timestamp),
        emotion: avatarEmotion,
      };

      setMessages((prev) => [...prev, avatarResponse]);

      // アバターの応答を音声で再生
      await playAIResponse(response.data.text);
    } catch (error) {
      console.error("AI応答の取得に失敗しました:", error);

      // エラー時のフォールバック応答
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "すみません、応答の生成中にエラーが発生しました。もう一度お試しください。",
        sender: "avatar",
        timestamp: new Date(),
        emotion: "sad",
      };

      setMessages((prev) => [...prev, errorResponse]);
      setCurrentEmotion("sad");

      // エラーメッセージも音声で再生
      await playAIResponse(errorResponse.text);
    } finally {
      setIsLoading(false);
    }
  };

  // Enterキーでメッセージ送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // スクロールを最下部に移動
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // メッセージが更新されたらスクロールを最下部に移動
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex flex-row h-screen w-[100%]">
      {/* アバター表示部分 */}
      <div ref={gltfCanvasParentRef} className="w-1/2 h-full">
        <Canvas
          frameloop="demand"
          camera={{ fov: 20, near: 0.1, far: 300, position: [0, 1, -10] }}
          flat
        >
          <directionalLight position={[1, 1, -1]} color={"0xFFFFFF"} />
          <Model currentEmotion={currentEmotion} url={url} />
          <color attach="background" args={["#f7f7f7"]} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={false}
          />
          <gridHelper />
        </Canvas>
      </div>

      {/* チャットUI部分 */}
      <div className="w-1/2 h-full p-4">
        <Card className="w-full h-full flex flex-col">
          {/* チャットメッセージ */}
          <CardContent className="overflow-y-auto p-4 space-y-4 flex-1">
            {messages.map((message) => (
              <MessageUi key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* テキスト入力 */}
          <CardFooter className="border-t p-4">
            <div className="w-full">
              <div className="flex items-end gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="メッセージを入力..."
                  className="flex-1 min-h-[80px] resize-none border rounded-md p-2"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-10 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                >
                  {isLoading ? "送信中..." : "送信"}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Enterキーで送信（Shift + Enterで改行）
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

// メッセージUIコンポーネント
interface MessageUiProps {
  message: ChatMessage;
}

const MessageUi = ({ message }: MessageUiProps) => {
  const isUser = message.sender === "user";
  const { user } = useUser();

  return (
    <div
      className={`flex items-start gap-4 w-full ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* アバター */}
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        {isUser ? (
          user?.name?.charAt(0) || "U"
        ) : (
          <span>{getEmotionEmoji(message.emotion || "neutral")}</span>
        )}
      </div>

      {/* メッセージ */}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className="text-xs mt-1 text-gray-500">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

// 感情のラベルを取得
const getEmotionLabel = (emotion: AvatarEmotion): string => {
  switch (emotion) {
    case "happy":
      return "嬉しい😊";
    case "sad":
      return "悲しい😢";
    case "surprised":
      return "驚き😮";
    case "angry":
      return "怒り😠";
    default:
      return "普通😐";
  }
};

// 感情の絵文字を取得
const getEmotionEmoji = (emotion: AvatarEmotion): string => {
  switch (emotion) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "surprised":
      return "😮";
    case "angry":
      return "😠";
    default:
      return "😐";
  }
};

interface ModelProps {
  currentEmotion: AvatarEmotion;
  url: string;
}

export const Model: FC<ModelProps> = ({ currentEmotion, url }) => {
  const [gltf, setGltf] = useState<GLTF | undefined>();
  const [progress, setProgress] = useState<number>(0);
  const [vrm, setVrm] = useState<VRM | null>(null);

  useEffect(() => {
    if (!gltf) {
      const loader = new GLTFLoader();
      loader.register((parser: any) => {
        return new VRMLoaderPlugin(parser);
      });

      loader.load(
        url,
        (tmpGltf: any) => {
          setGltf(tmpGltf);
          // VRMインスタンスを取得
          if (tmpGltf.userData.vrm) {
            setVrm(tmpGltf.userData.vrm);
          }
          console.log("loaded");
        },
        // called as loading progresses
        (xhr: any) => {
          setProgress((xhr.loaded / xhr.total) * 100);
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        (error: any) => {
          console.log("An error happened");
          console.log(error);
        }
      );
    }
  }, [gltf, url]);

  // 感情に応じた表情を設定
  useEffect(() => {
    if (vrm) {
      try {
        // 表情のブレンドシェイプを取得
        // VRMのバージョンによって異なる可能性があるため、代替的なアクセス方法を試みる
        const blendShapeProxy =
          (vrm as any).blendShapeProxy || vrm.expressionManager;

        if (blendShapeProxy) {
          // 全ての表情をリセット
          if (typeof blendShapeProxy.reset === "function") {
            blendShapeProxy.reset();
          }

          // 感情に基づいて表情を設定
          // 注：実際のVRMモデルで利用可能なブレンドシェイプ名は異なる可能性があります
          const setExpression = (name: string, value: number) => {
            if (typeof blendShapeProxy.setValue === "function") {
              blendShapeProxy.setValue(name, value);
            } else if (typeof blendShapeProxy.setWeight === "function") {
              blendShapeProxy.setWeight(name, value);
            }
          };

          switch (currentEmotion) {
            case "happy":
              // 笑顔表現
              setExpression("joy", 1.0);
              break;
            case "sad":
              // 悲しい表現
              setExpression("sorrow", 1.0);
              break;
            case "surprised":
              // 驚き表現
              setExpression("surprised", 1.0);
              break;
            case "angry":
              // 怒り表現
              setExpression("angry", 1.0);
              break;
            default:
              // デフォルト表情
              setExpression("neutral", 1.0);
              break;
          }

          // 更新処理
          if (typeof blendShapeProxy.update === "function") {
            blendShapeProxy.update();
          }
        }
      } catch (error) {
        console.error("アバターの表情設定に失敗しました:", error);
      }
    }
  }, [vrm, currentEmotion]);

  return (
    <>
      {gltf ? (
        <>
          <primitive object={gltf.scene} />
          <Html position={[0, 2, 0]}>
            <div className="bg-white px-3 py-1 rounded-full shadow-md text-sm">
              {getEmotionLabel(currentEmotion)}
            </div>
          </Html>
        </>
      ) : (
        <Html center>{progress} % loaded</Html>
      )}
    </>
  );
};
