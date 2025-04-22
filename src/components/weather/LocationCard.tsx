import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets } from 'lucide-react';
import { RankedLocation } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface LocationCardProps {
  location: RankedLocation;
  index: number;
  sortBy: 'temperature' | 'humidity';
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, index, sortBy }) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // Get appropriate background color based on rank
  const getBgColor = (rank: number) => {
    if (rank === 0) return 'bg-yellow-100 border-yellow-500';
    if (rank === 1) return 'bg-gray-100 border-gray-400';
    if (rank === 2) return 'bg-amber-100 border-amber-500';
    return 'bg-white border-gray-200';
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      className="w-full"
    >
      <Card className={`border-l-4 ${getBgColor(index)}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <span className="text-xl font-bold mr-2">#{index + 1}</span>
                <h3 className="text-lg font-medium">{location.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{location.condition}</p>
            </div>
            
            <div className={`flex items-center ${sortBy === 'temperature' ? 'text-red-600' : 'text-blue-600'}`}>
              {sortBy === 'temperature' ? (
                <Thermometer className="mr-1" size={18} />
              ) : (
                <Droplets className="mr-1" size={18} />
              )}
              <span className="text-xl font-bold">
                {sortBy === 'temperature' ? `${location.temperature}°C` : `${location.humidity}%`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};