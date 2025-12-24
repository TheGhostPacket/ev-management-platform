'use client';

import { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function ChargingStationMap({ stations = [] }) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: -0.1870,
    latitude: 5.6037,
    zoom: 11
  });

  // Close popup when clicking outside
  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedStation(null);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Charging Station Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedStation(station);
            }}
          >
            <div className="cursor-pointer hover:scale-110 transition">
              <svg
                width="30"
                height="40"
                viewBox="0 0 30 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 0C6.716 0 0 6.716 0 15c0 10 15 25 15 25s15-15 15-25c0-8.284-6.716-15-15-15z"
                  fill="#00af7d"
                />
                <circle cx="15" cy="15" r="6" fill="white" />
                <text
                  x="15"
                  y="19"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#00af7d"
                >
                  ⚡
                </text>
              </svg>
            </div>
          </Marker>
        ))}

        {/* Popup for selected station */}
        {selectedStation && (
          <Popup
            longitude={selectedStation.longitude}
            latitude={selectedStation.latitude}
            anchor="top"
            onClose={() => setSelectedStation(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {selectedStation.station_name}
              </h3>

              <div className="space-y-1 text-sm">
                {selectedStation.operator && (
                  <p className="text-gray-600">
                    <span className="font-medium">Operator:</span> {selectedStation.operator}
                  </p>
                )}

                <p className="text-gray-600">
                  <span className="font-medium">Type:</span> {selectedStation.charger_type}
                </p>

                <p className="text-gray-600">
                  <span className="font-medium">Power:</span> {selectedStation.power_output_kw} kW
                </p>

                {selectedStation.cost_per_kwh && (
                  <p className="text-gray-600">
                    <span className="font-medium">Cost:</span> GHS {selectedStation.cost_per_kwh}/kWh
                  </p>
                )}

                <p className={`font-semibold ${
                  selectedStation.availability_status === 'operational' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedStation.availability_status === 'operational' ? '✓ Available' : '✗ Unavailable'}
                </p>
              </div>

              {selectedStation.address && (
                <p className="text-xs text-gray-500 mt-2 border-t pt-2">
                  {selectedStation.address}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

// Usage Example:
/*
import ChargingStationMap from '@/components/hub/ChargingStationMap';

function ChargingStationsPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('/api/v1/charging-stations')
      .then(res => res.json())
      .then(data => setStations(data.data));
  }, []);

  return (
    <div>
      <h1>Charging Stations</h1>
      <ChargingStationMap stations={stations} />
    </div>
  );
}
*/
