import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMarker = ({ position, onPositionChange }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange([lat, lng]);
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ onLocationSelect, initialPosition, address }) => {
  const [position, setPosition] = useState(initialPosition || [28.6139, 77.2090]);
  const [selectedAddress, setSelectedAddress] = useState(address || '');
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handlePositionChange = async (newPosition) => {
    setPosition(newPosition);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition[0]}&lon=${newPosition[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const addr = data.display_name || '';
      setSelectedAddress(addr);
      onLocationSelect({
        coordinates: newPosition,
        address: addr,
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      onLocationSelect({
        coordinates: newPosition,
        address: selectedAddress,
      });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = [pos.coords.latitude, pos.coords.longitude];
          handlePositionChange(newPosition);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          placeholder="Enter address or click on map"
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="btn-outline text-sm px-3 py-2"
        >
          📍 Use Current
        </button>
        <button
          type="button"
          onClick={() => setIsMapOpen(!isMapOpen)}
          className="btn-outline text-sm px-3 py-2"
        >
          {isMapOpen ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
      {isMapOpen && (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} onPositionChange={handlePositionChange} />
          </MapContainer>
        </div>
      )}
      {position && (
        <p className="text-xs text-gray-500">
          Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
