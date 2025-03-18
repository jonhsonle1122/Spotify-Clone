import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout.tsx";
import NotFoundPage from "./pages/404/NotFoundPage";
import AdminPage from "./pages/admin/AdminPage.tsx";
import AlbumPage from "./pages/album/AlbumPage.tsx";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
