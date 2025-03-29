import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./apis/user/user.js";
import threadRouter from "./apis/thread/thread.js";
import messageRouter from "./apis/message/message.js";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [process.env.FRONT_APP_URL!],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-User-Id"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// 環境変数のテスト
// console.log(process.env.TEST);

app.route("/api/users", userRouter);
app.route("/api/threads", threadRouter);
app.route("/api/messages", messageRouter);

serve(
  {
    fetch: app.fetch,
    port: 3777,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
