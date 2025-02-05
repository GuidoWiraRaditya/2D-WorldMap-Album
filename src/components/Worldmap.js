import { useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapClickHandler =({ onCountryClick }) => {
    useMapEvents({
        click: async(e) => {
            const { lat, lng } = e.latlng;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();
            if (data && data.address) {
                onCountryClick(data.address.country);
            }
        },
    });
    return null;
};

export default function WorldMap() {
    const handleCountryClick = (country) => {
        alert(`You clicked on : ${country}`);
    };

    return (
        <MapContainer center={[20,0]} zoom={2} style={{ height: "100vh", width: "100vw"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onCountryClick={handleCountryClick}/>
        </MapContainer>
    )
}