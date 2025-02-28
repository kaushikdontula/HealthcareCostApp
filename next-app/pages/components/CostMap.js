import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import styles
import { FaInfoCircle } from 'react-icons/fa'; // Import the info icon

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN; // Replace with your token

const CostMap = ({ hospitals }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9857); // Default longitude (New York)
  const [lat, setLat] = useState(40.7484);  // Default latitude (New York)
  const [zoom, setZoom] = useState(12);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');  // Default style

  const mapStyles = [
    { label: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
    { label: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
    { label: 'Navigation Day', url: 'mapbox://styles/mapbox/navigation-day-v1' },
    { label: 'Navigation Night', url: 'mapbox://styles/mapbox/navigation-night-v1' },
  ];

  useEffect(() => {
    if (map.current) return; // Prevent map from initializing more than once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,  // Use selected map style
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Add markers for hospitals
    if (hospitals && hospitals.length > 0) {
      hospitals.forEach(hospital => {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker'; // For CSS styling
        markerEl.innerHTML = `$${hospital.avgCost}`; // Display the cost

        // Style the markerEl
        markerEl.style.width = '50px';  // Adjust as needed
        markerEl.style.height = '50px'; // Adjust as needed
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#fff';
        markerEl.style.color = '#000';  // Or your theme's text color
        markerEl.style.textAlign = 'center';
        markerEl.style.lineHeight = '50px'; // Vertically center the text
        markerEl.style.fontWeight = 'bold';
        markerEl.style.border = '2px solid #007bff'; // Example border
        markerEl.style.cursor = 'pointer';
        markerEl.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        markerEl.style.fontSize = '14px';
        markerEl.style.fontFamily = 'sans-serif';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';


        const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' }) // Use custom element
          .setLngLat([hospital.longitude, hospital.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // Add popups
              .setHTML(
                `<h4>${hospital.name}</h4>`  // Removed avgCost from popup
              )
          )
          .addTo(map.current);
      });
    }
  }, [hospitals, mapStyle]);  // Added mapStyle as a dependency

  // Update map style when selected
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);


  return (
    <section id="map" className="mt-40"> 
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4"> {/* Style container */}
        <div>
          <div className="text-gray-600 text-sm">
            Longitude: <span className="font-medium text-gray-800">{lng}</span> | Latitude: <span className="font-medium text-gray-800">{lat}</span> | Zoom: <span className="font-medium text-gray-800">{zoom}</span>
          </div>
        </div>

        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"  // Styled dropdown
        >
          {mapStyles.map((style) => (
            <option key={style.url} value={style.url}>
              {style.label}
            </option>
          ))}
        </select>
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '400px', borderRadius: '1rem', overflow: 'hidden' }} />
    </section>
  );
};

export default CostMap;
