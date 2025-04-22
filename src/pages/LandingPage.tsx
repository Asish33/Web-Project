import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CloudSun, Wind, Droplets, ThermometerSun, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: custom * 0.2, duration: 0.5 }
    }),
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3 }
    }
  };

  // Features data
  const features = [
    {
      title: 'Real-Time Weather',
      description: 'Get accurate, up-to-the-minute weather information for any location worldwide.',
      icon: <CloudSun className="h-10 w-10 text-blue-500" />
    },
    {
      title: 'Detailed Forecasts',
      description: 'View comprehensive weather details including temperature, humidity, wind speed, and more.',
      icon: <ThermometerSun className="h-10 w-10 text-orange-500" />
    },
    {
      title: 'Global Rankings',
      description: 'Explore top locations sorted by temperature and humidity from around the world.',
      icon: <MapPin className="h-10 w-10 text-purple-500" />
    },
    {
      title: 'Responsive Design',
      description: 'Access weather information on any device with our beautiful, responsive interface.',
      icon: <Wind className="h-10 w-10 text-teal-500" />
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <div>
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                >
                  Your Personal Weather Assistant
                </motion.h1>
                
                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl mb-8 text-blue-100"
                >
                  Get real-time weather updates with beautiful visualizations and detailed information for any location around the world.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Login
                  </Button>
                </motion.div>
              </div>
              
              <motion.div
                variants={itemVariants}
                className="hidden lg:block"
              >
                <img
                  src="https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Weather App Dashboard Preview"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Powerful Weather Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover everything our weather application has to offer with these amazing features.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white rounded-lg p-8 shadow-md"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Experience the Weather App?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust our application for accurate weather information.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Sign Up Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};