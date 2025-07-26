import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalGasStation, Water, VolumeDown } from '@mui/icons-material';

interface EULabelProps {
  fuelEfficiency: string; // A, B, C, D, E, F, G
  wetGrip: string; // A, B, C, D, E, F, G
  noiseLevel: number; // в дБ
  size?: 'small' | 'medium' | 'large';
  variant?: 'horizontal' | 'vertical';
}

const EULabel: React.FC<EULabelProps> = ({
  fuelEfficiency,
  wetGrip,
  noiseLevel,
  size = 'medium',
  variant = 'horizontal'
}) => {
  // Цвета для разных классов
  const getEfficiencyColor = (grade: string) => {
    const colors = {
      'A': '#16A34A', // Зеленый
      'B': '#65A30D', // Светло-зеленый
      'C': '#CA8A04', // Желтый
      'D': '#EA580C', // Оранжевый
      'E': '#DC2626', // Красный
      'F': '#B91C1C', // Темно-красный
      'G': '#7F1D1D'  // Очень темно-красный
    };
    return colors[grade as keyof typeof colors] || '#6B7280';
  };

  const getWetGripColor = (grade: string) => {
    const colors = {
      'A': '#1D4ED8', // Синий
      'B': '#2563EB', // Светло-синий
      'C': '#3B82F6', // Голубой
      'D': '#60A5FA', // Светло-голубой
      'E': '#93C5FD', // Очень светло-голубой
      'F': '#BFDBFE', // Бледно-голубой
      'G': '#DBEAFE'  // Очень бледно-голубой
    };
    return colors[grade as keyof typeof colors] || '#6B7280';
  };

  const getNoiseColor = (noise: number) => {
    if (noise <= 68) return '#16A34A'; // Зеленый - тихие
    if (noise <= 71) return '#CA8A04'; // Желтый - средние
    return '#DC2626'; // Красный - громкие
  };

  // Размеры в зависимости от size
  const dimensions = {
    small: {
      blockSize: 32,
      fontSize: '0.75rem',
      iconSize: 16,
      gap: 0.5
    },
    medium: {
      blockSize: 48,
      fontSize: '0.875rem',
      iconSize: 20,
      gap: 1
    },
    large: {
      blockSize: 64,
      fontSize: '1rem',
      iconSize: 24,
      gap: 1.5
    }
  };

  const dim = dimensions[size];

  const blockStyle = {
    width: dim.blockSize,
    height: dim.blockSize,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 700,
    fontSize: dim.fontSize,
    position: 'relative' as const,
    overflow: 'hidden',
    gap: '2px' // Уменьшенный отступ между иконкой и буквой
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: variant === 'horizontal' ? 'row' : 'column',
      gap: dim.gap,
      alignItems: 'center'
    }}>
      {/* Топливная экономичность */}
      <Box sx={{
        ...blockStyle,
        backgroundColor: getEfficiencyColor(fuelEfficiency),
        border: `2px solid ${getEfficiencyColor(fuelEfficiency)}`
      }}>
        <LocalGasStation sx={{ fontSize: dim.iconSize }} />
        <Typography variant="caption" sx={{ 
          fontSize: dim.fontSize, 
          fontWeight: 700,
          lineHeight: 1
        }}>
          {fuelEfficiency}
        </Typography>
      </Box>

      {/* Сцепление на мокрой дороге */}
      <Box sx={{
        ...blockStyle,
        backgroundColor: getWetGripColor(wetGrip),
        border: `2px solid ${getWetGripColor(wetGrip)}`
      }}>
        <Water sx={{ fontSize: dim.iconSize }} />
        <Typography variant="caption" sx={{ 
          fontSize: dim.fontSize, 
          fontWeight: 700,
          lineHeight: 1
        }}>
          {wetGrip}
        </Typography>
      </Box>

      {/* Уровень шума */}
      <Box sx={{
        ...blockStyle,
        backgroundColor: getNoiseColor(noiseLevel),
        border: `2px solid ${getNoiseColor(noiseLevel)}`
      }}>
        <VolumeDown sx={{ fontSize: dim.iconSize }} />
        <Typography variant="caption" sx={{ 
          fontSize: dim.fontSize, 
          fontWeight: 700,
          lineHeight: 1
        }}>
          {noiseLevel}
        </Typography>
      </Box>
    </Box>
  );
};

export default EULabel; 