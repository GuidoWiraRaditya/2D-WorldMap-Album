import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

//get lat and long from the map
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.address) {
        onMapClick({ lat, lng, country: data.address.country });
      }
    },
  });
  return null;
};

//handle click action by adding marker
export default function WorldMap() {
  const [markers, setMarkers] = useState([]);
  const [popupPosition, setPopupPosition] = useState(null);

  const handleMapClick = ({ lat, lng, country }) => {
    setPopupPosition({ lat, lng, country });
  };

  const addMarker = () => {
    if (popupPosition) {
      setMarkers([...markers, popupPosition]);
      setPopupPosition(null);
    }
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onMapClick={handleMapClick} />

      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={defaultIcon}
        >
          <Popup>{marker.country}</Popup>
        </Marker>
      ))}

      {popupPosition && (
        <Marker position={[popupPosition.lat, popupPosition.lng]}>
          <Popup>
            <p>Add marker for {popupPosition.country}?</p>
            <button onClick={addMarker} style={{ marginRight: "5px" }}>
              Yes
            </button>
            <button onClick={() => setPopupPosition(null)}>No</button>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
