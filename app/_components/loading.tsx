import React from "react";
const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-2xl"></div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute w-full h-full animate-pulse bg-white/10 rounded-full backdrop-blur-lg shadow-2xl border border-white/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white drop-shadow-lg tracking-widest animate-fade-in font-mono uppercase">
            LOADING
          </span>
          <span className="text-sm text-gray-300 animate-bounce mt-2 font-sans">Please wait...</span>
        </div>
        <div
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-400 border-r-violet-400 shadow-xl"
          style={{ animationDuration: "1.5s", borderRadius: "50%" }}
        ></div>
      </div>
    </div>
  );
};
export default Loading;