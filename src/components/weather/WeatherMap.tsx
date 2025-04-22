import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '../ui/Card';
import { WeatherData } from '../../types';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  locations: {
    data: WeatherData;
    coordinates: [number, number];
  }[];
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ locations }) => {
  // Find center of the map based on locations
  const center: [number, number] = locations.length > 0
    ? locations[0].coordinates
    : [0, 0];

  return (
    <Card className="w-full h-[500px]">
      <CardContent className="p-0">
        <MapContainer
          center={center}
          zoom={4}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((loc, index) => (
            <Marker key={index} position={loc.coordinates}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{loc.data.location}</h3>
                  <p>{loc.data.temperature}°C</p>
                  <p>{loc.data.condition}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};