"use client";
import Image from "next/image";
import { useAuth } from "./Providers/AuthProvider";
import LoginPage from "./components/login";
import MainPage from "./components/mainPage";
export default function Home() {
  const {isAuthenticated} = useAuth();
  if (isAuthenticated === null) return <div>Loading...</div>;
  return (
    <div>
      {isAuthenticated ? <MainPage/> : <LoginPage/>}
    </div>
  );
}
