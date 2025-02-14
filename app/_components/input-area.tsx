import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ input, setInput, sendMessage }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 bg-black border-t border-zinc-800 backdrop-blur-lg bg-opacity-90"
    >
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="relative w-full bg-zinc-900 text-gray-200 placeholder-gray-500 p-4 rounded-lg border border-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          className="px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};