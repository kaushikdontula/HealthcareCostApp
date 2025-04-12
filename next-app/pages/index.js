import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChartLine, FaHospital, FaUserMd, FaArrowRight, FaRegUserCircle, FaRobot } from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import { MdCompareArrows } from 'react-icons/md';
import { FiSend, FiMessageSquare, FiMap, FiTable } from 'react-icons/fi';
import Footer from './components/footer';

export const Home = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const missionRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedService, setSelectedService] = useState('MRI');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

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
      router.push("/chatbot");
    } else {
      router.push("/sign-in");
    }
  };

  // Scroll to section functions
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update active section based on scroll position
  useEffect(() => {
    if (!router.isReady) return;
    const scrollTarget = router.query.scrollTo;
  
    if (scrollTarget === 'hero' && heroRef.current) {
      scrollToSection(heroRef);
      router.replace('/', undefined, { shallow: true });
    } else if (scrollTarget === 'features' && featuresRef.current) {
      scrollToSection(featuresRef);
      router.replace('/', undefined, { shallow: true });
    } else if (scrollTarget === 'mission' && missionRef.current) {
      scrollToSection(missionRef);
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.isReady, router.query.scrollTo]);  

  useEffect(() => {
    const handleCustomScroll = (e) => {
      const target = e.detail;
      if (target === 'hero') scrollToSection(heroRef);
      if (target === 'features') scrollToSection(featuresRef);
      if (target === 'mission') scrollToSection(missionRef);
    };
  
    window.addEventListener('scroll-to-section', handleCustomScroll);
    return () => window.removeEventListener('scroll-to-section', handleCustomScroll);
  }, []);
  
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

  // Feature card data
  const cardData = [
    {
      id: '1',
      title: 'Empower with Knowledge',
      description: 'We eliminate confusion around healthcare pricing by making it accessible and easy to understand for everyone.',
      icon: <RiMentalHealthLine className="text-5xl text-primary" />,
      stat: useCounter(87),
      statLabel: '% of users report better healthcare decisions'
    },
    {
      id: '2',
      title: 'Healthcare Price Transparency',
      description: 'We expose the unnecessarily complicated pricing system in U.S. healthcare, showing users the true magnitude of the problem.',
      icon: <FaHospital className="text-5xl text-primary" />,
      stat: useCounter(10000),
      statLabel: '+ providers in our database'
    },
    {
      id: '3',
      title: 'Data-Driven Insights',
      description: 'Our platform provides detailed analysis through interactive charts that help users compare and understand healthcare prices.',
      icon: <FaChartLine className="text-5xl text-primary" />,
      stat: useCounter(42),
      statLabel: '% average savings for informed patients'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Navigation dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-4">
          <motion.button 
            onClick={() => scrollToSection(heroRef)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${activeSection === 'hero' ? 'bg-primary scale-125' : 'bg-gray-300'}`}
            whileHover={{ scale: 1.2 }}
          />
          <motion.button 
            onClick={() => scrollToSection(featuresRef)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${activeSection === 'features' ? 'bg-primary scale-125' : 'bg-gray-300'}`}
            whileHover={{ scale: 1.2 }}
          />
          <motion.button 
            onClick={() => scrollToSection(missionRef)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${activeSection === 'mission' ? 'bg-primary scale-125' : 'bg-gray-300'}`}
            whileHover={{ scale: 1.2 }}
          />
        </div>
      </div>

      {/* SECTION 1: Hero section */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex flex-col justify-center overflow-hidden snap-start"
        id="hero"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 opacity-20 animate-gradient" />
        
        <div className="relative px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-3xl text-center mt-[-10vh]">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-bold tracking-tight text-black sm:text-6xl mb-4"
            >
              <span className="block">Understand</span>
              <span className="relative inline-block">
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
              Access real pricing data from thousands of providers nationwide. 
              Compare costs, understand billing, and make informed healthcare decisions with our interactive tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 w-full max-w-xl mx-auto"
            >
              {/* Chat input styled similar to the actual app but inverted colors */}
              <div className="flex items-center bg-white p-2 rounded-full shadow-lg">
                <input 
                  type="text" 
                  placeholder="Ask a question about healthcare costs..."
                  className="flex-grow bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-4 py-2"
                />
                <button
                  onClick={() => router.push('/chatbot')}
                  className="ml-1 p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all"
                >
                  <FiSend size={18} />
                </button>
              </div>

              {/* Quick access icons */}
              <div className="flex justify-center gap-6 mt-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <button
                    onClick={() => router.push('/map')}
                    className="p-3 bg-white text-primary rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <FiMap size={24} />
                  </button>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Interactive Cost Map
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <button
                    onClick={() => router.push('/tabularData')}
                    className="p-3 bg-white text-primary rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <FiTable size={24} />
                  </button>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Tabular Data View
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="max-w-2xl mx-auto"
            >
              {/* Removed this section as we're now using the simpler direct interface above */}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <motion.button 
              onClick={() => scrollToSection(featuresRef)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2 text-primary font-medium"
            >
              <span>See Features</span>
              <FaChevronDown className="text-3xl text-primary animate-bounce" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Features section */}
      <section 
        ref={featuresRef} 
        className="relative min-h-screen flex flex-col justify-center py-20 bg-gray-50 snap-start"
        id="features"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="relative inline-block">
                Powerful Features
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: false }}
                />
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've processed complex healthcare pricing data to give you simple, 
              clear access to information that was previously hidden in plain sight.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: AI Chatbot */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:ring-2 hover:ring-orange-500 group cursor-pointer"
              onClick={() => router.push('/chatbot')}
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <FiMessageSquare className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Chatbot</h3>
                <p className="text-gray-600 mb-4">
                  Ask any question about healthcare costs and get instant, data-backed answers 
                  from our AI assistant with access to our complete pricing database.
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-t">
                <div className="py-3 px-4 bg-gray-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary rounded-full p-2 text-white">
                      <FaRobot className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">What's the average cost of an MRI in Chicago?</div>
                      <div className="mt-1 text-gray-500">The average cost for an MRI in Chicago is $1,250, ranging from $450 to $3,200 depending on facility and insurance...</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 2: Cost Map */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:ring-2 hover:ring-orange-500 group cursor-pointer"
              onClick={() => router.push('/map')}
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <FiMap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Cost Map</h3>
                <p className="text-gray-600 mb-4">
                  Visualize healthcare costs geographically and zoom in to street level to find 
                  and compare pricing at specific providers in your area.
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-t flex justify-center">
                <div className="relative w-full h-32 bg-green-50 rounded-lg overflow-hidden">
                  {/* Mock map with price indicators */}
                  <div className="absolute inset-0 bg-blue-100 opacity-50"></div>
                  <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$$$</div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$$</div>
                  <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 3: Data Table */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:ring-2 hover:ring-orange-500 group cursor-pointer"
              onClick={() => router.push('/tabularData')}
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <FiTable className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Data</h3>
                <p className="text-gray-600 mb-4">
                  Access, filter, and export detailed pricing data for thousands of medical procedures. 
                  Sort by provider, CPT code, price range, and more.
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-t">
                <div className="w-full h-32 bg-white rounded-lg overflow-hidden border border-gray-200">
                  {/* Mock data table */}
                  <div className="bg-gray-800 text-white text-xs py-2 px-3 grid grid-cols-4">
                    <div>CPT Code</div>
                    <div>Procedure</div>
                    <div>Provider</div>
                    <div>Price</div>
                  </div>
                  <div className="text-xs py-2 px-3 grid grid-cols-4 border-b">
                    <div>99213</div>
                    <div>Office Visit</div>
                    <div>City Hospital</div>
                    <div className="font-medium">$125</div>
                  </div>
                  <div className="text-xs py-2 px-3 grid grid-cols-4 border-b bg-gray-50">
                    <div>73721</div>
                    <div>MRI Knee</div>
                    <div>Medical Center</div>
                    <div className="font-medium">$950</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: false }}
            className="md:absolute md:bottom-10 md:left-0 md:right-0 flex justify-center mt-16 md:mt-0 pb-8"
            >
            <motion.button 
              onClick={() => scrollToSection(missionRef)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-2 text-primary font-medium"
            >
              <span>Our Impact</span>
              <FaChevronDown className="text-3xl text-primary animate-bounce" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Mission & Testimonials Combined */}
      <section 
        ref={missionRef} 
        className="relative min-h-screen py-20 bg-gradient-to-b from-white to-gray-50 snap-start"
        id="mission"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="relative inline-block">
                Our Mission & Impact
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: false }}
                />
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making healthcare costs transparent and accessible for everyone,
              empowering informed decisions and driving positive change in the healthcare system.
            </p>
          </motion.div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {cardData.map((card) => (
              <motion.div
                key={card.id}
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * parseInt(card.id) }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <div className="mb-4 text-primary">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-primary">{card.stat}</span>
                  <span className="ml-2 text-gray-500">{card.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonials Section - Slimmer Version */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-6xl mx-auto mt-10"
          >
            <h3 className="text-xl font-bold text-center mb-4">What Our Users Are Saying</h3>
            
            <div className="relative bg-white/70 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
              <div className="overflow-hidden h-24">
                <motion.div
                  className="flex transition-transform duration-500 h-full"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-6 py-3 flex items-center">
                      <div className="flex items-center space-x-4 w-full">
                        <div className="text-3xl">{testimonial.avatar}</div>
                        <div className="flex-1">
                          <p className="text-gray-700 italic text-sm md:text-base">{testimonial.text}</p>
                          <div className="flex items-baseline mt-1 text-sm">
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-gray-500 ml-2">— {testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      currentTestimonial === index ? 'bg-primary w-4' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;