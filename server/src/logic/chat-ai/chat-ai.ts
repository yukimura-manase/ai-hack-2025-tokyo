import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  createAiPersonalityPrompt,
  createMisakiLoveAttackPrompt,
  createMisakiStoryPrompt,
} from "../../constants/make-hiroin.js";
import {
  createSoumaLastJudgmentPrompt,
  createSoumaStoryPrompt,
} from "@/constants/nakamura-souma.js";

export class ChatAiLogic {
  private constructor() {}

  /**
   * ユーザーメッセージに対するAI応答を生成する
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateAIResponse(content: string): Promise<string> {
    try {
      const systemPrompt: string = createAiPersonalityPrompt();

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
   * 斉藤 美咲（さいとう みさき）のAI応答を生成する
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateMisakiResponse(
    content: string[]
  ): Promise<string> {
    try {
      const systemPrompt: string = createMisakiStoryPrompt(content);

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
   * 中村 颯真（なかむら そうま）のAI応答を生成する
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateSoumaResponse(
    content: string[]
  ): Promise<string> {
    try {
      const systemPrompt: string = createSoumaStoryPrompt(content);

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
   * 斉藤 美咲（さいとう みさき）が告白する。
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateMisakiLoveAttackResponse(
    content: string[]
  ): Promise<string> {
    try {
      const systemPrompt: string = createMisakiLoveAttackPrompt(content);

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
   * 中村 颯真（なかむら そうま）からの告白の判定を生成する。
   * @param content ユーザーメッセージの内容
   * @returns AI応答テキスト
   */
  public static async generateSoumaLastJudgmentResponse(
    content: string[]
  ): Promise<string> {
    try {
      const systemPrompt: string = createSoumaLastJudgmentPrompt(content);

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
   * ユーザーメッセージから感情を分析する
   * @param content ユーザーメッセージの内容
   * @returns 感情の種類（"neutral" | "happy" | "sad" | "surprised" | "angry"）
   */
  public static async analyzeEmotion(content: string): Promise<string> {
    try {
      const systemPrompt: string = `
      あなたは、ユーザーメッセージから感情を分析するアシスタントです。
      メッセージの内容を分析して、最も適切な感情カテゴリを返してください。
      
      感情カテゴリ:
      - neutral：中立的、感情がない、または平常
      - happy：嬉しい、幸せ、ポジティブ
      - sad：悲しい、落ち込んでいる、ネガティブ
      - surprised：驚き、意外、ショック
      - angry：怒り、イライラ、不満
      
      制約条件:
      - 必ず上記5つのカテゴリのうち1つだけを返してください
      - カテゴリ名のみを返してください（説明は不要）
      - 日本語での分析を行ってください
      `;

      const promptTemplate: ChatPromptTemplate<any, any> =
        ChatPromptTemplate.fromMessages([
          ["system", systemPrompt],
          ["user", "以下のメッセージの感情を分析してください:\n{input}"],
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

      const emotion: string = await llmChain.invoke({
        input: content,
      });

      // 余分な空白や改行を削除して結果を正規化
      const normalizedEmotion = emotion.trim().toLowerCase();

      // 有効な感情カテゴリに含まれているか確認
      const validEmotions = ["neutral", "happy", "sad", "surprised", "angry"];

      if (validEmotions.includes(normalizedEmotion)) {
        return normalizedEmotion;
      } else {
        // 有効でない場合はデフォルトとしてneutralを返す
        console.warn(
          `無効な感情カテゴリ "${normalizedEmotion}" が検出されました。`
        );
        return "neutral";
      }
    } catch (error) {
      console.error("感情分析に失敗しました:", error);
      return "neutral"; // エラー時はデフォルトとしてneutralを返す
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
