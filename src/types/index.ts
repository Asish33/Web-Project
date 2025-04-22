export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  default_location: string;
  temperature_unit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  condition: string;
  icon: string;
  feels_like: number;
  precipitation: number;
  forecast: ForecastDay[];
  alerts?: WeatherAlert[];
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherAlert {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  start: string;
  end: string;
}

export interface RankedLocation {
  name: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
}

export interface FavoriteLocation {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}