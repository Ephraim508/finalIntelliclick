import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MyMapComponent = () => {
  // Extract latitude and longitude from Redux store
  const { latitude, longitude } = useSelector((state) => ({
    latitude: state.latitude,
    longitude: state.longitude
  }));

  // Initialize state with Redux store values
  const [position, setPosition] = useState([latitude || 78.4772, longitude || 17.4065]);

  // Update position when latitude or longitude changes
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "175px", width: "310px", borderRadius: "10px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          This is the exact location for latitude: {position[0]}, longitude: {position[1]}.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMapComponent;
