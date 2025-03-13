import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-600 to-gray-900 text-white p-10">
      {/* Animated Welcome Text */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold mb-4 text-center"
      >
        Welcome to the Question Paper Predictor
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-2xl text-center max-w-2xl"
      >
        Our AI-powered system analyzes previous years' papers 📄 and predicts **repeated questions** 🧠 for better exam preparation.
      </motion.p>

      {/* Get Started Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="mt-6 px-6 py-3 bg-emerald-400 text-black font-semibold rounded-lg shadow-md"
        onClick={() => navigate("/home")}
      >
        Get Started 🚀
      </motion.button>
    </div>
  );
};

export default Intro;
