import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const ChangeMapView = ({ center, zoom = 16 }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

export default ChangeMapView;

