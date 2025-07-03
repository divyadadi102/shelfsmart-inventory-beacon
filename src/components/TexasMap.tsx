
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const TexasMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // You'll need to add your Mapbox token here
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRsZXg3cTEwMzNkMmlwdGx5c2Z1azNvIn0.Q7nOKlBcZkZtH2lZG0RvQA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95.3698, 29.7604], // Houston coordinates
      zoom: 6,
      pitch: 0,
    });

    // Add Houston marker
    new mapboxgl.Marker({
      color: '#ef4444'
    })
    .setLngLat([-95.3698, 29.7604])
    .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-red-600" />
          <span>Store Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-2">
          <p className="text-lg font-bold text-red-600">Houston, TX</p>
          <p className="text-xs text-gray-600">Primary Store Location</p>
        </div>
        <div ref={mapContainer} className="w-full h-32 rounded-lg" />
      </CardContent>
    </Card>
  );
};

export default TexasMap;
