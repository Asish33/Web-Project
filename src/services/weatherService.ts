import axios from 'axios';
import { WeatherData, RankedLocation, ForecastDay, WeatherAlert } from '../types';
import { supabase } from '../lib/supabase';
import { addDays, subDays, format } from 'date-fns';

// Parse the wttr.in response to our weather data format
const parseWeatherData = (data: any, location: string): WeatherData => {
  const current = data.current_condition[0];
  const forecast = data.weather.map((day: any): ForecastDay => ({
    date: day.date,
    maxTemp: parseInt(day.maxtempC),
    minTemp: parseInt(day.mintempC),
    condition: day.hourly[4].weatherDesc[0].value,
    icon: `https://cdn.weatherapi.com/weather/64x64/day/${day.hourly[4].weatherCode}.png`,
    precipitation: parseFloat(day.hourly[4].precipMM),
    humidity: parseInt(day.hourly[4].humidity),
    windSpeed: parseInt(day.hourly[4].windspeedKmph),
  }));

  // Parse weather alerts if available
  const alerts: WeatherAlert[] = data.weather_alerts?.map((alert: any) => ({
    type: alert.type,
    severity: getSeverityLevel(alert.severity),
    description: alert.description,
    start: alert.start,
    end: alert.end,
  })) || [];
  
  return {
    location,
    temperature: parseInt(current.temp_C),
    humidity: parseInt(current.humidity),
    windSpeed: parseInt(current.windspeedKmph),
    pressure: parseInt(current.pressure),
    uvIndex: parseInt(current.uvIndex),
    condition: current.weatherDesc[0].value,
    icon: `https://cdn.weatherapi.com/weather/64x64/day/${current.weatherCode}.png`,
    feels_like: parseInt(current.FeelsLikeC),
    precipitation: parseInt(current.precipMM),
    forecast,
    alerts,
  };
};

const getSeverityLevel = (severity: number): 'low' | 'medium' | 'high' => {
  if (severity <= 3) return 'low';
  if (severity <= 6) return 'medium';
  return 'high';
};

// Fetch weather data for a specific location
export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    // Using the wttr.in API with JSON format and 7-day forecast
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(location)}?format=j1&days=7`);
    return parseWeatherData(response.data, location);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Get coordinates for a location
export const getLocationCoordinates = async (location: string): Promise<[number, number]> => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
    );
    const { lat, lng } = response.data.results[0].geometry;
    return [lat, lng];
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return [0, 0];
  }
};

// List of major cities around the world
const majorCities = [
  'London', 'New York', 'Tokyo', 'Sydney', 'Paris',
  'Singapore', 'Dubai', 'Los Angeles', 'Mumbai', 'Toronto',
  'Rio de Janeiro', 'Berlin', 'Cape Town', 'Mexico City', 'Moscow'
];

// Fetch weather data for multiple locations
export const fetchMultipleLocationsWeather = async (): Promise<RankedLocation[]> => {
  try {
    const promises = majorCities.map(async (city) => {
      try {
        const data = await fetchWeatherData(city);
        return {
          name: city,
          temperature: data.temperature,
          humidity: data.humidity,
          condition: data.condition,
          icon: data.icon,
        };
      } catch (error) {
        console.error(`Error fetching data for ${city}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result): result is RankedLocation => result !== null);
  } catch (error) {
    console.error('Error fetching multiple locations weather:', error);
    throw new Error('Failed to fetch multiple locations weather');
  }
};

// Get the current location of the user
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

// Convert coordinates to location name using reverse geocoding
export const getLocationNameFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    return response.data.city || response.data.locality || 'Unknown Location';
  } catch (error) {
    console.error('Error fetching location name:', error);
    return 'Unknown Location';
  }
};

// Favorite locations functions
export const getFavoriteLocations = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorite_locations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addFavoriteLocation = async (userId: string, locationName: string) => {
  const { error } = await supabase
    .from('favorite_locations')
    .insert({ user_id: userId, name: locationName });

  if (error) throw error;
};

export const removeFavoriteLocation = async (userId: string, locationName: string) => {
  const { error } = await supabase
    .from('favorite_locations')
    .delete()
    .eq('user_id', userId)
    .eq('name', locationName);

  if (error) throw error;
};

// Calculate average temperature for the week
export const calculateWeeklyAverage = (forecast: ForecastDay[]): number => {
  const sum = forecast.reduce((acc, day) => acc + ((day.maxTemp + day.minTemp) / 2), 0);
  return Math.round(sum / forecast.length);
};