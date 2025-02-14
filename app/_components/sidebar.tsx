import React from "react";
import { X, Plus, Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  sessions: string[];
  currentSession: string;
  setCurrentSession: (session: string) => void;
  addNewSession: () => void;
  editingSession: string | null;
  startEditing: (session: string) => void;
  editValue: string;
  setEditValue: (value: string) => void;
  saveEdit: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSession,
  setCurrentSession,
  addNewSession,
  editingSession,
  startEditing,
  editValue,
  setEditValue,
  saveEdit,
  setSidebarOpen,
}) => {
  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed md:relative w-80 h-full bg-black border-r border-zinc-800 backdrop-blur-lg bg-opacity-90 z-50"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            MeChat
          </h2>
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addNewSession}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          New Chat
        </motion.button>

        <div className="space-y-2">
          {sessions.map((session, index) => (
            <motion.div
              key={session}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group flex items-center justify-between p-3 rounded-lg backdrop-blur-sm transition-all cursor-pointer
                ${currentSession === session
                  ? 'bg-zinc-900 border border-zinc-800'
                  : 'hover:bg-zinc-900/50'}`}
              onClick={() => setCurrentSession(session)}
            >
              {editingSession === session ? (
                <input
                  type="text"
                  className="flex-1 bg-zinc-800 text-white p-2 rounded-md mr-2"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                />
              ) : (
                <span className="text-gray-300">{session}</span>
              )}
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(session);
                }}
              >
                <Pencil size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};