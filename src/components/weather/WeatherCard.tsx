import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  Gauge, 
  AlertTriangle,
  Heart,
  Calendar
} from 'lucide-react';
import { WeatherData } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { addFavoriteLocation, removeFavoriteLocation } from '../../services/weatherService';
import { toast } from 'react-hot-toast';

interface WeatherCardProps {
  data: WeatherData;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  data, 
  isFavorite = false,
  onFavoriteToggle 
}) => {
  const { user } = useAuth();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Helper to determine background color based on temperature
  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return 'from-blue-400 to-blue-600';
    if (temp <= 10) return 'from-blue-300 to-teal-500';
    if (temp <= 20) return 'from-teal-400 to-green-500';
    if (temp <= 30) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      toast.error('Please log in to save favorite locations');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteLocation(user.id, data.location);
        toast.success('Location removed from favorites');
      } else {
        await addFavoriteLocation(user.id, data.location);
        toast.success('Location added to favorites');
      }
      onFavoriteToggle?.();
    } catch (error) {
      toast.error('Failed to update favorite location');
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      {/* Current Weather Card */}
      <Card className="overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${getTemperatureColor(data.temperature)} text-white`}>
          <div className="flex justify-between items-center">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{data.location}</h2>
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavoriteClick}
                    icon={<Heart className={isFavorite ? 'fill-current' : ''} size={18} />}
                    className="text-white hover:text-white/80"
                  />
                )}
              </div>
              <p className="text-white/80">{data.condition}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-right">
              <p className="text-4xl font-bold">{data.temperature}°C</p>
              <p className="text-white/80">Feels like {data.feels_like}°C</p>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Droplets className="text-blue-500" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Humidity</p>
                <p className="font-semibold">{data.humidity}%</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Wind className="text-teal-500" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Wind Speed</p>
                <p className="font-semibold">{data.windSpeed} km/h</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Gauge className="text-purple-500" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Pressure</p>
                <p className="font-semibold">{data.pressure} hPa</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Sun className="text-yellow-500" size={24} />
              <div>
                <p className="text-gray-600 text-sm">UV Index</p>
                <p className="font-semibold">{data.uvIndex}</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <Thermometer className="text-red-500" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Precipitation</p>
                <p className="font-semibold">{data.precipitation} mm</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                Weather Alerts
              </h3>
              <div className="space-y-2">
                {data.alerts.map((alert, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-gray-600">{alert.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.start).toLocaleString()} - {new Date(alert.end).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* 3-Day Forecast */}
      <Card>
        <CardContent className="p-4">
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              3-Day Forecast
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.forecast.map((day, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 flex flex-col items-center"
                >
                  <p className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <img src={day.icon} alt={day.condition} className="w-12 h-12 my-2" />
                  <p className="text-sm text-gray-600">{day.condition}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-red-500">{day.maxTemp}°</span>
                    <span className="text-blue-500">{day.minTemp}°</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Humidity: {day.humidity}%</p>
                    <p>Wind: {day.windSpeed} km/h</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};