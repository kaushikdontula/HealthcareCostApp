import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChartLine, FaHospital, FaUserMd, FaArrowRight, FaRegUserCircle } from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import { MdCompareArrows } from 'react-icons/md';
import { FiSend } from 'react-icons/fi'; // For Chatbot Animation
import { FaRobot } from 'react-icons/fa'; // Robot icon

export const Home = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState('hospitals');
  const [showCostDemo, setShowCostDemo] = useState(false);
  const [selectedService, setSelectedService] = useState('MRI');
  const [hoveredCard, setHoveredCard] = useState(null); // Unused, keeping for now
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const howWeHelpRef = useRef(null); // Ref for the "How We Help" section

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  // Animated counter hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      let animationFrame;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };

      animationFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
  };

  const handleNavigation = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  // Scroll to "How We Help" section
  const scrollToHowWeHelp = () => {
    howWeHelpRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sample cost comparison data
  const costData = {
    'MRI': {
      'Hospital A': 2500,
      'Hospital B': 1800,
      'Hospital C': 3200,
      'National Average': 2400
    },
    'CT Scan': {
      'Hospital A': 1200,
      'Hospital B': 950,
      'Hospital C': 1600,
      'National Average': 1300
    },
    'Blood Test': {
      'Hospital A': 180,
      'Hospital B': 120,
      'Hospital C': 210,
      'National Average': 150
    }
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "👩‍⚕️",
      role: "Healthcare Administrator",
      text: "This app has transformed how we communicate costs to patients. They come in more informed and less anxious about billing."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "👨‍💼",
      role: "Patient",
      text: "I saved over $3,000 on my procedure by comparing costs across different hospitals in my area. The transparency is revolutionary."
    },
    {
      id: 3,
      name: "Dr. Patel",
      avatar: "👨‍⚕️",
      role: "Cardiologist",
      text: "Finally, I can have honest conversations with my patients about the financial aspects of their care without guesswork."
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Feature card data
  const cardData = [
    {
      id: '1',
      title: 'Empower with Knowledge',
      description: 'We aim to eliminate the confusion around healthcare pricing by making it easy for anyone to understand.',
      icon: <RiMentalHealthLine className="text-5xl text-primary" />,
      stat: useCounter(87),
      statLabel: '% of users report better healthcare decisions'
    },
    {
      id: '2',
      title: 'Shed Light on Healthcare Pricing',
      description: 'Healthcare pricing in the U.S. is unnecessarily complicated. We\'re here to show users the magnitude of the problem.',
      icon: <FaHospital className="text-5xl text-secondary" />,
      stat: useCounter(10000),
      statLabel: '+ providers in our database'
    },
    {
      id: '3',
      title: 'Comprehensive Data Analysis',
      description: 'Our platform provides detailed data analysis and various types of charts that help users compare healthcare prices.',
      icon: <FaChartLine className="text-5xl text-accent" />,
      stat: useCounter(42),
      statLabel: '% average savings for informed patients'
    }
  ];

  // Animated Chatbot Demo Data
  const initialChatbotMessages = [
    { text: "Hello! How can I help you understand healthcare costs today?", sender: "bot" },
    { text: "What's the average cost of an MRI in my area?", sender: "user" },
    { text: "In your location an MRI can range from $400-$3500 with the average cost being $2450.50.", sender: "bot" },
    { text: "Which hospital had the lowest procedure cost?", sender: "user" },
    { text: "The hospital with the lowest cost was ____ with a price of $567.24.", sender: "bot" },
    { text: "Thanks!", sender: "user" },
    { text: "No problem, let me know if any other questions arise!", sender: "bot" }
  ];
  const [chatbotMessages, setChatbotMessages] = useState([]); // Start empty
  const [messageIndex, setMessageIndex] = useState(0);
  const [showAllMessages, setShowAllMessages] = useState(false);

  useEffect(() => {
    if (messageIndex < initialChatbotMessages.length && !showAllMessages) {
      const timeout = setTimeout(() => {
        setChatbotMessages([...chatbotMessages, initialChatbotMessages[messageIndex]]);
        setMessageIndex(messageIndex + 1);
      }, 1500); // Add a message every 1.5 seconds

      return () => clearTimeout(timeout); // Clear timeout on unmount or if dependencies change
    }
  }, [messageIndex, chatbotMessages, showAllMessages]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 opacity-20 animate-gradient" />

      {/* Hero section */}
      <div className="relative px-6 lg:px-8 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-bold tracking-tight text-black sm:text-6xl mb-4"
            >
              <span className="block">Understand</span>
              <span className="relative">
                <span className="text-black">
                  Healthcare Costs
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
              <span className="block mt-2 text-gray-700">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-xl leading-8 text-gray-600 mb-8"
            >
              Compare prices, understand billing, and make informed decisions
              about your healthcare with our interactive tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={handleNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                <span>Start Exploring</span>
                <FaArrowRight />
              </motion.button>

              <motion.button
                onClick={() => setShowCostDemo(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary border-2 border-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                <span>Try Demo</span>
                <MdCompareArrows />
              </motion.button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex justify-center pb-8"
        >
            <motion.button onClick={scrollToHowWeHelp}  whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}>
                <FaChevronDown className="text-4xl text-gray-600 animate-bounce" />
            </motion.button>
        </motion.div>
      </div>

      {/* Interactive Cost Comparison Demo */}
      <AnimatePresence>
        {showCostDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto"
              layoutId="cost-demo"
            >
              <div className="p-4 bg-gray-100 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mx-1"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mx-1"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mx-1"></div>
                </div>
                <h3 className="text-xl font-bold text-center">Healthcare Cost Comparison</h3>
                <button onClick={() => setShowCostDemo(false)} className="text-gray-500 hover:text-red-500">
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="text-lg font-medium mb-2 block">Select medical service:</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(costData).map(service => (
                      <button
                        key={service}
                        onClick={() => setSelectedService(service)}
                        className={`px-4 py-2 rounded-full transition-all ${selectedService === service ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-4">Cost comparison for {selectedService}</h4>
                  <div className="space-y-4">
                    {Object.entries(costData[selectedService]).map(([hospital, cost]) => (
                      <div key={hospital} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{hospital}</span>
                          <span className={`font-bold ${cost < costData[selectedService]['National Average'] ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(cost / 4000) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-2.5 rounded-full ${cost < costData[selectedService]['National Average']
                              ? 'bg-green-500'
                              : 'bg-red-500'
                              }`}
                          />
                        </div>
                        {hospital === 'National Average' && (
                          <div className="mt-1 text-sm text-gray-500 italic">Reference price</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaUserMd className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-blue-800">Cost Insight</h4>
                        <p className="text-sm text-blue-700">
                          Prices for {selectedService} can vary by up to {Math.round((Math.max(...Object.values(costData[selectedService])) /
                            Math.min(...Object.values(costData[selectedService])) - 1) * 100)}% between providers! This demonstrates how shopping around can save you significant money.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNavigation}
                  className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <span>See full cost analysis for all procedures</span>
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={howWeHelpRef} className="container mx-auto px-4 py-20">
        {/* Interactive service tabs */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="relative inline-block">
              How We Help You Navigate Healthcare Costs
              <motion.span
                className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h2>

          <div className="flex justify-center mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-6 py-3 mx-2 my-2 rounded-full transition-all ${activeTab === 'hospitals'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              Hospital Costs
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-6 py-3 mx-2 my-2 rounded-full transition-all ${activeTab === 'insurance'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              Insurance Coverage
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`px-6 py-3 mx-2 my-2 rounded-full transition-all ${activeTab === 'medications'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              Medication Prices
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-700"
            >
              {activeTab === 'hospitals' && (
                <div>
                  Our hospital cost comparison tool allows you to see prices for
                  common procedures at different hospitals in your area.
                  Understand potential out-of-pocket costs before you receive care.
                </div>
              )}
              {activeTab === 'insurance' && (
                <div>
                  Navigate the complexities of insurance coverage with our guides
                  and resources. Learn how to understand your policy and maximize
                  your benefits.
                </div>
              )}
              {activeTab === 'medications' && (
                <div>
                  Discover the prices of prescription medications at various pharmacies.
                  Find coupons and discounts to save money on your prescriptions.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature cards section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              onHoverStart={() => setHoveredCard(card.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">{card.stat}</span>
                <span className="ml-2 text-gray-500">{card.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Parallax section */}
        <div ref={ref} className="relative h-[600px] overflow-hidden">
          <motion.div
            style={{ scale, opacity, y }}
            className="absolute inset-0 bg-[url('/images/hero-image.jpg')] bg-cover bg-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">  {/* Removed bg-black/60 */}
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-black text-4xl font-bold text-center mb-6"
            >
              Our Revolutionary Chatbot for Easier Analysis
            </motion.h2>
            {/* Animated Chatbot Demo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-4/5 max-w-4xl bg-white rounded-xl shadow-2xl p-6" // Increased width
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaRobot className="text-2xl text-primary" />
                <h4 className="text-lg font-semibold">Healthcare Cost Assistant</h4>
              </div>
              <div className="space-y-2">
                {chatbotMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}  // Staggered appearance
                    className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-gray-100 text-gray-800 self-end ml-auto' : 'bg-gray-700 text-gray-100 self-start'}`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </div>
              {/* Demo Input (Not Functional) */}
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled // It's just a demo
                />
                <button className="p-3 ml-2 rounded-full bg-primary text-white" disabled> {/* It's just a demo */}
                  <FiSend />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Testimonials section */}
        <div className="max-w-4xl mx-auto py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="relative inline-block">
              What Our Users Are Saying
              <motion.span
                className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h2>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-6">
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">{testimonial.avatar}</div>
                    <p className="text-gray-700 italic mb-4">{testimonial.text}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Healthcare Costs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
