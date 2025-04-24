import { motion } from "framer-motion";
import { BookOpenText } from "lucide-react";

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-gray-800 to-blue-900 text-white text-center py-10 px-4 border-t-[1.5px] border-gray-500/40
 shadow-lg"
  >
    <div className="flex items-center justify-center gap-3 text-base text-gray-400">
      <BookOpenText className="w-5 h-5 text-blue-500" />
      <span>
        &copy; {new Date().getFullYear()} Library Management System. All Rights Reserved.
      </span>
    </div>
  </motion.footer>
);

export default Footer;
