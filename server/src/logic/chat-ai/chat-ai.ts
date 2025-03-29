import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export class ChatAiLogic {
  private constructor() {}

  /**
   * ユーザーメッセージに対するAI応答を生成する
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateAIResponse(content: string): Promise<string> {
    try {
      const systemPrompt: string = this.createAiPersonalityPrompt();

      const promptTemplate: ChatPromptTemplate<any, any> =
        this.createPromptTemplate(systemPrompt);

      /** Geminiのモデルを作成する。 */
      const geminiModel: ChatGoogleGenerativeAI = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: process.env.GEMINI_MODEL_NAME,
        maxOutputTokens: 2048,
        temperature: 0.7,
      });

      /** 出力パーサーを作成する。 */
      const outputParser = new StringOutputParser();

      /** チェーンを作成する。 */
      const llmChain = promptTemplate.pipe(geminiModel).pipe(outputParser);

      const aiAnswer: string = await llmChain.invoke({
        input: content,
      });
      return aiAnswer;
    } catch (error) {
      console.error("AI応答の生成に失敗しました:", error);
      return "申し訳ありません、応答を生成できません";
    }
  }

  /**
   * ユーザーとAIのやり取りからスレッド名を自動生成する
   * @param messages 会話メッセージの配列
   * @returns 生成されたスレッド名
   */
  public static async generateThreadTitle(
    messages: { sender: string; content: string }[]
  ): Promise<string> {
    try {
      const systemPrompt: string = `
      あなたは、ユーザーとAIの会話からスレッドタイトルを生成するアシスタントです。
      会話の内容を分析して、簡潔で的確なタイトルを生成してください。
      
      制約条件:
        - タイトルは最大20文字以内にしてください。
        - 会話の主要トピックを簡潔に表現してください。
        - 日本語で返答してください。
        - タイトルのみを返してください。（説明や前置きは不要です）
      `;

      const promptTemplate: ChatPromptTemplate<any, any> =
        ChatPromptTemplate.fromMessages([
          ["system", systemPrompt],
          [
            "user",
            "以下の会話から適切なスレッドタイトルを生成してください:\n{input}",
          ],
        ]);

      /** Geminiのモデルを作成する。 */
      const geminiModel: ChatGoogleGenerativeAI = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: process.env.GEMINI_MODEL_NAME,
        maxOutputTokens: 100,
        temperature: 0.3,
      });

      /** 出力パーサーを作成する。 */
      const outputParser = new StringOutputParser();

      /** チェーンを作成する。 */
      const llmChain = promptTemplate.pipe(geminiModel).pipe(outputParser);

      // メッセージを文字列に変換
      const messagesText = messages
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n\n");

      const title: string = await llmChain.invoke({
        input: messagesText,
      });

      // 余分な空白や改行を削除
      return title.trim();
    } catch (error) {
      console.error("スレッドタイトル生成に失敗しました:", error);
      return "新しい会話";
    }
  }

  /** AIの人格設定, 制約条件, 回答条件などを設定する。 */
  private static createAiPersonalityPrompt(): string {
    {
      return `
    あなたは、ユーザーからの相談に乗るChatBotです。
    また、あなたは、以下の制約条件と回答条件を厳密に守る必要があります。

    制約条件:
      - あなたは、ユーザーからの相談に適切に回答する必要があります。
    `;
    }
  }

  /**
   * プロンプトテンプレートの作成
   * - systemPrompt: AI側の人格設定など
   * - userQuery: ユーザーの質問
   */
  private static createPromptTemplate(
    systemPrompt: string
  ): ChatPromptTemplate<any, any> {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      // ユーザーの入力
      ["user", "{input}"],
    ]);

    return prompt;
  }
}
