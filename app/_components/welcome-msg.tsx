import React from "react";
import { motion } from "framer-motion";

const capitalizeFirstLetter = (name: string) => {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

const WelcomeMessage = React.memo(({ userName }: { userName: string }) => (
  <div className="flex flex-col">
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-gray-400 text-sm font-medium"
    >
      Welcome ,
    </motion.span>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-xl font-bold tracking-wider animate-gradient"
    >
      {capitalizeFirstLetter(userName)}
    </motion.span>
  </div>
));

//Req for prod
WelcomeMessage.displayName = "WelcomeMessage";

export default WelcomeMessage;