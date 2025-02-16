import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaChevronDown } from 'react-icons/fa';

export const Home = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  const handleNavigation = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const cardData = [
    {
      id: '1',
      title: 'Empower with Knowledge',
      description: 'We aim to eliminate the confusion around healthcare pricing by making it easy for anyone to understand.',
      icon: '💡',
    },
    {
      id: '2',
      title: 'Shed Light on Healthcare Pricing',
      description: 'Healthcare pricing in the U.S. is unnecessarily complicated. Were here to show users the magnitude of the problem.',
      icon: '🔍',
    },
    {
      id: '3',
      title: 'Comprehensive Data and Analysis',
      description: 'Our platform provides detailed data analysis and various types of charts that help users compare healthcare prices.',
      icon: '📊',
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 opacity-20" />
      <div className="relative px-6 lg:px-8 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4"
            >
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary 80%, via-secondary 90%, to-accent 100%" style={{ backgroundSize: '200% 100%', color: '#000' }}>
                Healthcare Cost App
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-xl leading-8 text-gray-600 mb-8"
            >
              Understand and compare healthcare costs with ease
            </motion.p>
            <motion.button
              onClick={handleNavigation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out"
            >
              Go to Dashboard
            </motion.button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center pb-8"
        >
          <FaChevronDown className="text-4xl text-gray-600 animate-bounce" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          What We Do
        </motion.h2>

        <motion.div 
          ref={ref}
          style={{ scale, opacity, y }}
          className="mb-24"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-100">
              <div className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 inline-block mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 inline-block"></div>
            </div>
            <div className="p-8">
              {/* Replace this with your actual chatbot interface image */}
              <div className="bg-gray-200 h-96 flex items-center justify-center text-gray-500">
                Your Chatbot Interface Image Here
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
          {cardData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <div className="text-5xl mb-6">{card.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{card.title}</h3>
              <p className="text-gray-600 text-lg">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>&copy; 2025 Healthcare Cost App. All rights reserved.</p>
            <a href="/contact" className="hover:text-primary transition duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
