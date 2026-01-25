import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = ({ items = [], height = '400px' }) => {
  if (!items || items.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No locations to display</p>
      </div>
    );
  }

  const validItems = items.filter((item) => 
    item.location?.coordinates && 
    item.location.coordinates.length === 2 &&
    item.location.coordinates[0] !== 0 &&
    item.location.coordinates[1] !== 0
  );

  if (validItems.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No valid locations to display</p>
      </div>
    );
  }

  const center = validItems[0].location.coordinates;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height }}>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validItems.map((item, index) => (
          <Marker
            key={index}
            position={item.location.coordinates}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                {item.location.address && (
                  <p className="text-xs text-gray-600 mt-1">{item.location.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
