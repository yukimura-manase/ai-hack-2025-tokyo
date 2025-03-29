import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/constants/env";
import { AppRouter } from "./router/AppRouter.tsx";

// Vite React App のエントリーポイント
// id="root" のDOMに対してReactをマウントする
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRouter />
    </GoogleOAuthProvider>
  </StrictMode>
);
