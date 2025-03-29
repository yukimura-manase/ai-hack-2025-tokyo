import { Hono } from "hono";
import { globalPrisma } from "@/libs/dbClient.js";
import { HTTPException } from "hono/http-exception";
import type { User } from "@chemical-data-search-ai-agent/shared/src/types/user.js";

export const userRouter = new Hono();

/** ユーザー一覧取得 */
userRouter.get("/", async (context) => {
  return context.text("Hello User!");
});

/** 特定のユーザー取得 */
userRouter.get("/:userId", async (context) => {
  try {
    const userId = context.req.param("userId");
    if (!userId) {
      return context.text("Missing parameters", 400);
    }

    const user: User | null = await globalPrisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      // ユーザーが見つからない場合は、nullを返却する。
      return context.json(null);
    }

    return context.json(user);
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});

/** Google認証情報を検証し、ユーザーが存在するかどうかを確認する。 */
userRouter.post("/verify-google-auth", async (context) => {
  try {
    const { email } = await context.req.json<{
      email: string;
    }>();

    if (!email) {
      throw new HTTPException(400, { message: "Missing email parameter" });
    }

    // メールアドレスでユーザーを検索する。
    const existingUser: User | null = await globalPrisma.user.findUnique({
      where: { email },
    });
    console.log("existingUser", existingUser);

    // ユーザーが存在するかどうかを返す
    return context.json({
      exists: Boolean(existingUser),
      user: existingUser,
    });
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});

/** ユーザーの新規登録 */
userRouter.post("/", async (context) => {
  try {
    const { name, email, companyName, affiliation, position, googleId } =
      await context.req.json<{
        name: string;
        email: string;
        companyName: string;
        affiliation?: string;
        position?: string;
        googleId?: string;
      }>();

    if (!name || !email || !companyName) {
      // 400エラーを返却する。
      throw new HTTPException(400, { message: "Missing parameters" });
    }

    // 既存ユーザーを取得する。
    const existingUser = await globalPrisma.user.findUnique({
      where: { email },
    });

    // 既存ユーザーが存在する場合は、400エラーを返却する。
    if (existingUser) {
      throw new HTTPException(400, { message: "User already exists" });
    }

    const newUser = await globalPrisma.user.create({
      data: {
        name,
        email,
        companyName,
        affiliation,
        position,
        googleId,
      },
    });
    return context.json(newUser, 201);
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});
