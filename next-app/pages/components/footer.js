import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from "next/router";

export default function Footer() {
    const router = useRouter();
  
    return (
        <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Healthcare Costs</h3>
              <p className="text-gray-300">Making healthcare pricing transparent and accessible for everyone.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm text-gray-400 font-medium mb-2">Landing Page</h4>
                  <ul className="space-y-2">
                    {/* Navigate to the home of landing page */}
                    <li>
                      <button
                          onClick={() => {
                          if (router.pathname === '/') {
                              // We're already on the homepage, scroll directly
                              window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: 'hero' }));
                          } else {
                              // Navigate to home and then scroll
                              router.push({ pathname: '/', query: { scrollTo: 'hero' } });
                          }
                          }}
                          className="text-gray-300 hover:text-white transition"
                        >  
                          Home
                      </button>
                    </li>
                    {/* Navigate to the features section of landing page */}
                    <li>
                      <button
                          onClick={() => {
                          if (router.pathname === '/') {
                              // We're already on the homepage, scroll directly
                              window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: 'features' }));
                          } else {
                              // Navigate to home and then scroll
                              router.push({ pathname: '/', query: { scrollTo: 'features' } });
                          }
                          }}
                          className="text-gray-300 hover:text-white transition"
                        >  
                          Features
                      </button>
                    </li>
                    {/* Navigate to the mission section of landing page */}
                    <li>
                      <button
                          onClick={() => {
                          if (router.pathname === '/') {
                              // We're already on the homepage, scroll directly
                              window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: 'mission' }));
                          } else {
                              // Navigate to home and then scroll
                              router.push({ pathname: '/', query: { scrollTo: 'mission' } });
                          }
                          }}
                          className="text-gray-300 hover:text-white transition"
                        >  
                          Our Mission
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 font-medium mb-2">Application</h4>
                  <ul className="space-y-2">
                    <li><button onClick={() => router.push('/chatbot')} className="text-gray-300 hover:text-white transition">AI Healthcare Assistant</button></li>
                    <li><button onClick={() => router.push('/map')} className="text-gray-300 hover:text-white transition">Cost Map</button></li>
                    <li><button onClick={() => router.push('/tabularData')} className="text-gray-300 hover:text-white transition">Tabular Data</button></li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <p className="text-gray-300">Have questions? We'd love to hear from you.</p>
              <a href="mailto:info@healthcarecosts.com" className="text-gray-300 hover:text-white transition mt-2 inline-block">
                info@healthcarecosts.com
              </a>
              
              <div className="mt-4">
                <h4 className="text-sm text-gray-400 font-medium mb-2">Leave a Review</h4>
                <a href="#" className="text-gray-300 hover:text-white transition flex items-center gap-1">
                  <span>Share your experience</span>
                  <FaArrowRight className="text-xs" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Healthcare Costs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
}
