import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface YandexMapProps {
  address: string;
  coordinates?: [number, number];
  height?: number | string;
}

const YandexMap: React.FC<YandexMapProps> = ({ 
  address, 
  coordinates = [43.834928, 46.707786], // Кизляр, ул. Набережная, 107
  height = 400 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверяем, доступен ли API Яндекс.Карт
    if (typeof window !== 'undefined' && (window as any).ymaps) {
      initMap();
    } else {
      // Загружаем API Яндекс.Карт
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.onload = () => {
        (window as any).ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    }

    function initMap() {
      if (!mapRef.current) return;

      const map = new (window as any).ymaps.Map(mapRef.current, {
        center: coordinates,
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl']
      });

      const placemark = new (window as any).ymaps.Placemark(coordinates, {
        hintContent: 'ProKolesa',
        balloonContent: `
          <div style="padding: 10px;">
            <strong>ProKolesa</strong><br/>
            ${address}<br/>
            <a href="tel:+79886440244">+7 988 644 02 44</a>
          </div>
        `
      }, {
        preset: 'islands#redIcon'
      });

      map.geoObjects.add(placemark);
    }
  }, [address, coordinates]);

  return (
    <Box sx={{ position: 'relative', height }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '12px',
          overflow: 'hidden'
        }} 
      />
      
      {/* Fallback на случай если карта не загрузится */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#E9ECEF',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: -1
      }}>
        <LocationOn sx={{ fontSize: 60, color: '#6C757D', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#6C757D', mb: 1 }}>
          Карта местоположения
        </Typography>
        <Typography variant="body2" sx={{ color: '#6C757D' }}>
          {address}
        </Typography>
      </Box>
    </Box>
  );
};

export default YandexMap; 