import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets } from 'lucide-react';
import { RankedLocation } from '../../types';
import { LocationCard } from './LocationCard';
import { Button } from '../ui/Button';

interface TopLocationsProps {
  locations: RankedLocation[];
}

export const TopLocations: React.FC<TopLocationsProps> = ({ locations }) => {
  const [sortBy, setSortBy] = useState<'temperature' | 'humidity'>('temperature');
  
  // Sort locations based on selected criterion
  const sortedLocations = [...locations].sort((a, b) => {
    if (sortBy === 'temperature') {
      return b.temperature - a.temperature;
    } else {
      return b.humidity - a.humidity;
    }
  }).slice(0, 10);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Top 10 Locations</h2>
        
        <div className="flex space-x-2">
          <Button
            variant={sortBy === 'temperature' ? 'primary' : 'outline'}
            onClick={() => setSortBy('temperature')}
            icon={<Thermometer size={18} />}
            size="sm"
          >
            Temperature
          </Button>
          
          <Button
            variant={sortBy === 'humidity' ? 'primary' : 'outline'}
            onClick={() => setSortBy('humidity')}
            icon={<Droplets size={18} />}
            size="sm"
          >
            Humidity
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedLocations.map((location, index) => (
          <LocationCard
            key={location.name}
            location={location}
            index={index}
            sortBy={sortBy}
          />
        ))}
      </div>
    </motion.div>
  );
};