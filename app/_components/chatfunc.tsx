"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Menu, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import WelcomeMessage from "./welcome-msg";
import { Sidebar } from "./sidebar";
import { ChatMessages } from "./chatmsgs";
import { InputArea } from "./input-area";
import { saveToLocalStorage, loadFromLocalStorage } from "@/utils/localStorageUtils";

type Message = {
  text: string;
  sender: "user" | "bot";
};

export default function ChatApp({ userEmail, userName, onLogout }: { userEmail: string; userName: string, onLogout: () => void }) {
  const [jwt] = useState<string | null>(localStorage.getItem("jwt"));
  const [chatSessions, setChatSessions] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const CHAT_SESSIONS_KEY = `myApp_chatSessions_${userEmail}`;
  const SESSIONS_KEY = `myApp_sessions_${userEmail}`;

  useEffect(() => {
    const savedSessions: Record<string, Message[]> = loadFromLocalStorage(CHAT_SESSIONS_KEY, {});
    const savedSessionList: string[] = loadFromLocalStorage(SESSIONS_KEY, []);

    if (Object.keys(savedSessions).length > 0 && savedSessionList.length > 0) {
      setSessions(savedSessionList);
      setChatSessions(savedSessions);
      setCurrentSession(savedSessionList[0]);
    } else {
      const initialSession = "New Chat";
      setSessions([initialSession]);
      setChatSessions({ [initialSession]: [] });
      setCurrentSession(initialSession);

      saveToLocalStorage(CHAT_SESSIONS_KEY, { [initialSession]: [] });
      saveToLocalStorage(SESSIONS_KEY, [initialSession]);
    }
  }, [userEmail, CHAT_SESSIONS_KEY, SESSIONS_KEY]);

  useEffect(() => {
    if (Object.keys(chatSessions).length > 0 && sessions.length > 0) {
      saveToLocalStorage(CHAT_SESSIONS_KEY, chatSessions);
      saveToLocalStorage(SESSIONS_KEY, sessions);
    }
  }, [chatSessions, sessions, userEmail, CHAT_SESSIONS_KEY, SESSIONS_KEY]);

  useEffect(() => {
    if (currentSession && jwt) {

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
  
      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8084", {
        auth: { token: jwt },
        query: { session: currentSession },
      });
  

      socketRef.current.emit("authenticate", jwt);

      socketRef.current.on("authenticated", () => {
        console.log("Authenticated with server");
      });
  
      socketRef.current.on("message", (data: string) => {
        try {
          const parsedData = JSON.parse(data); 
          console.log("📩 Parsed Message received:", parsedData);
      
          setChatSessions((prev) => {
            const currentChat = prev[currentSession] || [];
            const updatedMessages: Message[] = [
              ...currentChat,
              { text: parsedData.text, sender: "bot" as const },
            ];
            return { ...prev, [currentSession]: updatedMessages };
          });
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      });
      
      socketRef.current.on("unauthorized", (error: { error: string }) => {
        console.error("❌ Unauthorized:", error.error);
        socketRef.current?.disconnect();
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Disconnected from server");
      });
  
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [currentSession, jwt]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatSessions]);

  const sendMessage = () => {
    if (input.trim() === "") return;
  
    setChatSessions((prev) => {
      const currentChat = prev[currentSession] || [];
      const updatedMessages: Message[] = [
        ...currentChat,
        { text: input, sender: "user" },
      ];
      return { ...prev, [currentSession]: updatedMessages };
    });
  
    if (socketRef.current) {
      const messageData = {
        text: input,
        sender: "user" as const,
        session: currentSession,
        userEmail: userEmail,
      };
      socketRef.current.emit("message", JSON.stringify(messageData));
    }
  
    setInput("");
  };

  const addNewSession = () => {
    const sessionNumber = sessions.length + 1;
    const newSession = `New Chat ${sessionNumber}`;
    setSessions(prev => [...prev, newSession]);
    setChatSessions(prev => ({ ...prev, [newSession]: [] }));
    setCurrentSession(newSession);
    setSidebarOpen(false);
  };

  const startEditing = (session: string) => {
    setEditingSession(session);
    setEditValue(session);
  };

  const saveEdit = () => {
    if (!editValue.trim() || !editingSession) return;

    const updatedSessions = sessions.map(s =>
      s === editingSession ? editValue : s
    );
    const updatedChats = { ...chatSessions };
    updatedChats[editValue] = updatedChats[editingSession as string];
    delete updatedChats[editingSession as string];

    setSessions(updatedSessions);
    setChatSessions(updatedChats);
    setCurrentSession(editValue);
    setEditingSession(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen bg-black"
    >
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth > 768) && (
          <Sidebar
            sessions={sessions}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            addNewSession={addNewSession}
            editingSession={editingSession}
            startEditing={startEditing}
            editValue={editValue}
            setEditValue={setEditValue}
            saveEdit={saveEdit}
            setSidebarOpen={setSidebarOpen}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black border-b border-zinc-800 backdrop-blur-lg bg-opacity-90 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <WelcomeMessage userName={userName} />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white transition-all border border-zinc-800 hover:border-zinc-700"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </motion.div>

        <ChatMessages chatSessions={chatSessions} currentSession={currentSession} />

        <InputArea input={input} setInput={setInput} sendMessage={sendMessage} />
      </div>
    </motion.div>
  );
}