import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function WorldMap() {
    const [cityNames, setCityNames] = useState([]);
    const [cityMarkers, setCityMarkers] = useState([]);

    //get country name from json file in public folder
    useEffect(() =>{
        const loadCityNames = async () =>{
            try {
                const response = await fetch ("/cities.json");
                const data = await response.json();
                setCityNames(data);
            } catch (error) {
                console.error("Error loading json file", error);
            }
        };
        loadCityNames();
    }, []);

    useEffect(() => {
        if (cityNames.length === 0) return;

        const fetchCoordinates = async () => {
            const markers = [];
            for (const city of cityNames) {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`
                    );
                    const data = await response.json();
                    if ( data.length > 0) {
                        markers.push({
                            name: city,
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon),
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching coordinates for city : ${city} reason :`, error);
                }
            }
            setCityMarkers(markers);
        };

        fetchCoordinates();
    }, [cityNames]);

    return (
        <MapContainer center={[20,0]} zoom={2} style={{ height: "100vh", width: "100vw"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {cityMarkers.map((city, index) => (
                <Marker key={index} position={[city.lat, city.lng]} icon={customIcon}>
                    <Popup>{city.name}</Popup>
                </Marker>
            ))}
            
        </MapContainer>
    )
}