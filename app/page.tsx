"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/auth';
import Loading from "./_components/loading";
import ChatApp from "./_components/chatfunc"

export default function Home() {

  const { isAuthenticated, isLoading,user,logout } = useAuth();
  const router = useRouter();
  useEffect(() => {

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <Loading />;

  if (!isAuthenticated) return null;

  return <ChatApp userEmail={user?.email} userName={user?.username} onLogout={logout}/>;
}