import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { WeatherData } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface CityComparisonProps {
  cities: WeatherData[];
}

export const CityComparison: React.FC<CityComparisonProps> = ({ cities }) => {
  const temperatureData = cities.map(city => ({
    name: city.location,
    Temperature: city.temperature,
    'Feels Like': city.feels_like,
  }));

  const humidityWindData = cities.map(city => ({
    name: city.location,
    Humidity: city.humidity,
    'Wind Speed': city.windSpeed,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Temperature Comparison</h3>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Temperature" fill="#ef4444" />
                <Bar dataKey="Feels Like" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">Humidity & Wind Comparison</h3>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={humidityWindData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Humidity" fill="#22c55e" />
                <Bar dataKey="Wind Speed" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};