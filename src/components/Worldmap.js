import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//Custom Icon can be configured using your own png file
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function WorldMap() {
    const [cityMarkers, setCityMarkers] = useState([]);

    //fetch city markers based on name stored in json file    
    useEffect(() => {
        const fetchCityMarkers = async () => {
            try {
                const response = await fetch("/cities.json");
                const cityNames = await response.json();

                //fetch coordinates via API
                const coordinates= await Promise.all(
                    cityNames.map(async (city) => {
                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`
                            );
                            const data = await response.json();
                            if (data.length > 0) {
                                return {
                                    name: city,
                                    lat: parseFloat(data[0].lat),
                                    lng: parseFloat(data[0].lon),
                                };
                            }
                        } catch (error) {
                            console.error(`Error fetching coordinates for ${city}:`, error);
                        }
                        return null;
                    })
                );
                //remove marker for null results
                setCityMarkers(coordinates.filter((marker) => marker !==null));
            } catch (error) {
                console.error("Error loading city data:", error);
            }
        };

        fetchCityMarkers();
    }, []);

    return (
        <MapContainer center={[20,0]} zoom={2} style={{ height: "100vh", width: "100vw"}} zoomControl={false} maxBounds={[[85, -180], [-85, 180]]} maxBoundsViscosity={1.0} minZoom={2}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {cityMarkers.map((city, index) => (
                <Marker key={index} position={[city.lat, city.lng]} icon={customIcon}>
                    <Popup>{city.name}</Popup>
                </Marker>
            ))}

            <ZoomControl position="bottomright" />
            
        </MapContainer>
    )
}