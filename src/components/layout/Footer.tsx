import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-900 text-white py-8 mt-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CloudSun className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-bold">WeatherApp</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Get real-time weather updates and forecasts from around the world.
              Stay informed about temperature, humidity, wind speed, and more.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-400 transition-colors">Login</a>
              </li>
              <li>
                <a href="/register" className="hover:text-blue-400 transition-colors">Register</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                variants={iconVariants}
                whileHover="hover"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </motion.a>
              
              <motion.a
                href="#"
                variants={iconVariants}
                whileHover="hover"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </motion.a>
              
              <motion.a
                href="#"
                variants={iconVariants}
                whileHover="hover"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={24} />
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} WeatherApp. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};