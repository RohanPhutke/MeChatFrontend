import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessagesProps {
  chatSessions: { [key: string]: any[] };
  currentSession: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ chatSessions, currentSession }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
      <AnimatePresence>
        {chatSessions[currentSession]?.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md p-4 rounded-2xl backdrop-blur-sm
                ${msg.sender === "user"
                  ? 'bg-blue-600 bg-opacity-90 text-white ml-auto'
                  : 'bg-zinc-900 border border-zinc-800 text-gray-200'}`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};