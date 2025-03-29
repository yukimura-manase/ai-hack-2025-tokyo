import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// OpenAIのAPIキーを設定します
const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
// console.log("API Key:", apiKey);

const chatModel = new ChatOpenAI({
  apiKey,
});

// 3. outputParser を使って Responseから、回答のみを取り出すパターン
export async function ChatChainLLM(userQuery: string, aiCustomPrompt: string) {
  // Custom Prompt を設定
  const prompt = ChatPromptTemplate.fromMessages([
    // GPTのペルソナ設定
    ["system", aiCustomPrompt],
    // ユーザーの入力
    ["user", "{input}"],
  ]);

  // 文字の入出力を扱うためのパーサー
  const outputParser = new StringOutputParser();

  const llmChain = prompt.pipe(chatModel).pipe(outputParser);

  // ユーザーの入力をAIに渡して、回答を取得する
  const resText = await llmChain.invoke({
    input: userQuery,
  });
  console.log(resText);
  return resText;
}
