import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import MyPage from "@/pages/my-page";
import NotFoundPage from "@/pages/not-found";
import SignUpPage from "@/pages/sign-up";
import TalkRoomPage from "@/pages/talk-room";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/**
 * ルーティングを管理するコンポーネント
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ホームページ */}
        <Route path="/" element={<HomePage />} />

        {/* マイページ */}
        <Route path="/my-page" element={<MyPage />} />

        {/* ログインページ */}
        <Route path="/login" element={<LoginPage />} />

        {/* サインアップページ */}
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* チャットルームページ */}
        <Route path="/talk-room" element={<TalkRoomPage />} />
        {/* チャットルームページ Ver. スレッド選択状態 */}
        <Route path="/talk-room/:threadId" element={<TalkRoomPage />} />

        {/* 404ページ - 存在しないパスに対応 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
