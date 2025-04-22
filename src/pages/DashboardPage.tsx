import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Loader, Heart } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WeatherCard } from '../components/weather/WeatherCard';
import { TopLocations } from '../components/weather/TopLocations';
import { CityComparison } from '../components/weather/CityComparison';
import { WeatherMap } from '../components/weather/WeatherMap';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { 
  fetchWeatherData, 
  fetchMultipleLocationsWeather,
  getCurrentLocation,
  getLocationNameFromCoords,
  getLocationCoordinates,
  getFavoriteLocations,
} from '../services/weatherService';
import { WeatherData, RankedLocation, FavoriteLocation } from '../types';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [comparisonCity, setComparisonCity] = useState<WeatherData | null>(null);
  const [rankedLocations, setRankedLocations] = useState<RankedLocation[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonSearchQuery, setComparisonSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLocations, setMapLocations] = useState<{ data: WeatherData; coordinates: [number, number]; }[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && user) {
      handleGetCurrentLocation();
      loadRankedLocations();
      loadFavoriteLocations();
    }
  }, [isAuthenticated, user]);

  const loadFavoriteLocations = async () => {
    if (!user) return;
    
    try {
      const favorites = await getFavoriteLocations(user.id);
      setFavoriteLocations(favorites);
    } catch (error) {
      console.error('Failed to load favorite locations:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await fetchWeatherData(searchQuery);
      setWeatherData(data);
      
      // Update map locations - replace all locations with just this one
      const coordinates = await getLocationCoordinates(searchQuery);
      setMapLocations([{ data, coordinates }]);
      
      toast.success(`Weather data loaded for ${data.location}`);
    } catch (error) {
      toast.error('Failed to fetch weather data. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparisonSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comparisonSearchQuery.trim()) {
      toast.error('Please enter a location to compare');
      return;
    }
    
    setIsLoadingComparison(true);
    
    try {
      const data = await fetchWeatherData(comparisonSearchQuery);
      setComparisonCity(data);
      
      // Update map locations - add this location to existing ones
      const coordinates = await getLocationCoordinates(comparisonSearchQuery);
      setMapLocations(prev => [...prev, { data, coordinates }]);
      
      toast.success(`Comparison data loaded for ${data.location}`);
    } catch (error) {
      toast.error('Failed to fetch comparison data. Please try again.');
      console.error(error);
    } finally {
      setIsLoadingComparison(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      // Request location with high accuracy and timeout options
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Get location name from coordinates
      const locationName = await getLocationNameFromCoords(latitude, longitude);
      if (!locationName || locationName === 'Unknown Location') {
        throw new Error('Could not determine your location name');
      }

      const data = await fetchWeatherData(locationName);
      
      setWeatherData(data);
      setMapLocations([{ data, coordinates: [latitude, longitude] }]);
      
      toast.success(`Weather data loaded for your location: ${data.location}`);
    } catch (error) {
      console.error('Location error:', error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please enable location access in your browser settings to use your current location');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable at this time');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again');
            break;
          default:
            toast.error('Failed to get your location. Please search manually');
        }
      } else {
        toast.error('Failed to get your location. Please search manually');
      }
      
      // Don't automatically fall back to London - let the user search manually
      setWeatherData(null);
      setMapLocations([]);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const loadRankedLocations = async () => {
    setIsLoadingLocations(true);
    
    try {
      const locations = await fetchMultipleLocationsWeather();
      setRankedLocations(locations);
    } catch (error) {
      console.error('Failed to load ranked locations:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleFavoriteToggle = () => {
    loadFavoriteLocations();
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Header />
      
      <main className="flex-grow pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Dashboard</h1>
            <p className="text-gray-600">View real-time weather information for any location</p>
          </div>
          
          {/* Search Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Primary Search */}
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter a city or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search size={18} />}
                      fullWidth
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" isLoading={isLoading}>
                      Search
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetCurrentLocation}
                      isLoading={isGettingLocation}
                      icon={<MapPin size={18} />}
                    >
                      My Location
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Comparison Search */}
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleComparisonSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter a city to compare..."
                      value={comparisonSearchQuery}
                      onChange={(e) => setComparisonSearchQuery(e.target.value)}
                      icon={<Search size={18} />}
                      fullWidth
                    />
                  </div>
                  
                  <Button type="submit" isLoading={isLoadingComparison}>
                    Compare
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Favorite Locations */}
          {user && favoriteLocations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="text-red-500" size={24} />
                Favorite Locations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteLocations.map((location) => (
                  <Button
                    key={location.id}
                    variant="outline"
                    onClick={() => {
                      setSearchQuery(location.name);
                      handleSearch(new Event('submit') as any);
                    }}
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Weather Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {weatherData ? (
              <WeatherCard 
                data={weatherData}
                isFavorite={favoriteLocations.some(loc => loc.name === weatherData.location)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {isGettingLocation || isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-600">Loading weather data...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <MapPin className="h-10 w-10 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Search for a location or use your current location to view weather data
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {comparisonCity && (
              <WeatherCard 
                data={comparisonCity}
                isFavorite={favoriteLocations.some(loc => loc.name === comparisonCity.location)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
          </div>
          
          {/* Weather Map */}
          {mapLocations.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Weather Map</h2>
              <WeatherMap locations={mapLocations} />
            </div>
          )}
          
          {/* City Comparison */}
          {weatherData && comparisonCity && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">City Comparison</h2>
              <CityComparison cities={[weatherData, comparisonCity]} />
            </div>
          )}
          
          {/* Top Locations Section */}
          <div className="mb-10">
            {isLoadingLocations ? (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Loading top locations...</p>
                </div>
              </div>
            ) : (
              rankedLocations.length > 0 && <TopLocations locations={rankedLocations} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};