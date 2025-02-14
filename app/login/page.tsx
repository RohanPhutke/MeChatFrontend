"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth"; // Import Auth Context
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    const response = await login(email, password);

    if (response.success) {
      router.push("/");
    } else {
      setError(response.message!);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('bg.jpg')" }}
    >
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}