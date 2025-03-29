import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginButton } from "./hooks/useGoogleLoginButton";

export const GoogleLoginButton = () => {
  const { handleLoginSuccess, handleLoginError } = useGoogleLoginButton();

  return (
    <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
  );
};
