import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, Map as MapIcon, Loader } from 'lucide-react';
import axios from 'axios';

// Fix for default Leaflet icon not showing in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapDashboard() {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we would call: axios.get('http://localhost:8000/api/hotspots/')
        // Since backend DB is empty and we want a visual showcase for the Hackathon,
        // we'll simulate a fetch of clustered data points across Nigeria (where Interswitch is located)
        setTimeout(() => {
            const mockData = [
                { id: 1, disease_name: 'Leaf Blight', confidence: 0.88, latitude: 9.0820, longitude: 8.6753, created_at: '2026-10-12' }, // Central
                { id: 2, disease_name: 'Healthy', confidence: 0.95, latitude: 6.5244, longitude: 3.3792, created_at: '2026-10-10' }, // Lagos
                { id: 3, disease_name: 'Rust', confidence: 0.76, latitude: 7.3775, longitude: 3.9470, created_at: '2026-10-08' }, // Ibadan
                { id: 4, disease_name: 'Powdery Mildew', confidence: 0.91, latitude: 12.0022, longitude: 8.5920, created_at: '2026-10-11' }, // Kano
            ];
            setHotspots(mockData);
            setLoading(false);
        }, 1500);
    }, []);

    // Map center over Nigeria
    const center = [9.0820, 8.6753];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                    <MapIcon className="w-10 h-10 text-sage-700" /> Community Hotspots
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    A live geomatic visualization of crop health scans. Powered by high-resolution vector tiles from MapTiler.
                </p>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-earth-300 relative overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur z-[1000] flex flex-col items-center justify-center">
                        <Loader className="w-10 h-10 text-sage-700 animate-spin mb-4" />
                        <div className="text-lg text-gray-700 font-medium tracking-wide">Fetching telemetry...</div>
                    </div>
                )}

                <div className="rounded-2xl overflow-hidden h-[600px] relative z-0">
                    <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="w-full h-full">
                        <TileLayer
                            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY'}`}
                        />
                        {hotspots.map((spot) => (
                            <CircleMarker
                                key={spot.id}
                                center={[spot.latitude, spot.longitude]}
                                radius={spot.disease_name === 'Healthy' ? 8 : 14}
                                fillColor={spot.disease_name === 'Healthy' ? '#22c55e' : '#ef4444'}
                                color={spot.disease_name === 'Healthy' ? '#166534' : '#991b1b'}
                                weight={2}
                                fillOpacity={0.6}
                            >
                                <Popup>
                                    <div className="font-sans">
                                        <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">{spot.disease_name}</h3>
                                        <p className="text-sm">Confidence: <b>{Math.round(spot.confidence * 100)}%</b></p>
                                        <p className="text-sm text-gray-500 mt-1">Found: {spot.created_at}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
