import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Speed,
  FitnessCenter,
  Thermostat,
  VolumeDown,
  LocalGasStation,
  WaterDrop,
} from '@mui/icons-material';
import { Product, TireDetails, WheelDetails } from '../api';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  const renderTireSpecifications = (tireDetails: TireDetails) => {
    const getEULabelColor = (grade: string) => {
      switch (grade) {
        case 'A':
          return 'success';
        case 'B':
        case 'C':
          return 'warning';
        default:
          return 'error';
      }
    };

    return (
      <Box>
        {/* Размер шины */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Размер шины
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" color="primary">
                {tireDetails.width}/{tireDetails.profile} R{tireDetails.diameter}
              </Typography>
              <Box>
                <Chip label={`${tireDetails.load_index} ${tireDetails.speed_index}`} />
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Ширина
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {tireDetails.width} мм
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Профиль
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {tireDetails.profile}%
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Диаметр
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  R{tireDetails.diameter}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Индексы нагрузки и скорости */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Индексы
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Индекс нагрузки
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {tireDetails.load_index}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Индекс скорости
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {tireDetails.speed_index}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* EU Label */}
        {(tireDetails.fuel_efficiency || tireDetails.wet_grip || tireDetails.noise_level) && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Европейская маркировка
              </Typography>
              <Grid container spacing={2}>
                {tireDetails.fuel_efficiency && (
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalGasStation color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Топливная экономичность
                        </Typography>
                        <Chip
                          label={tireDetails.fuel_efficiency}
                          color={getEULabelColor(tireDetails.fuel_efficiency) as any}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tireDetails.wet_grip && (
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WaterDrop color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Сцепление на мокрой дороге
                        </Typography>
                        <Chip
                          label={tireDetails.wet_grip}
                          color={getEULabelColor(tireDetails.wet_grip) as any}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tireDetails.noise_level && (
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VolumeDown color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Уровень шума
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {tireDetails.noise_level} дБ
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Дополнительные характеристики */}
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {tireDetails.tread_pattern && (
                <TableRow>
                  <TableCell>Рисунок протектора</TableCell>
                  <TableCell>{tireDetails.tread_pattern}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell>Run Flat</TableCell>
                <TableCell>
                  <Chip
                    label={tireDetails.run_flat ? 'Да' : 'Нет'}
                    color={tireDetails.run_flat ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Усиленная</TableCell>
                <TableCell>
                  <Chip
                    label={tireDetails.reinforced ? 'Да' : 'Нет'}
                    color={tireDetails.reinforced ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Шипованная</TableCell>
                <TableCell>
                  <Chip
                    label={tireDetails.studded ? 'Да' : 'Нет'}
                    color={tireDetails.studded ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderWheelSpecifications = (wheelDetails: WheelDetails) => {
    return (
      <Box>
        {/* Размер диска */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Размер диска
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {wheelDetails.width}J x {wheelDetails.diameter}"
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Ширина
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {wheelDetails.width}J
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Диаметр
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {wheelDetails.diameter}"
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Параметры крепления */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Параметры крепления
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Разболтовка
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {wheelDetails.bolt_pattern}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Вылет (ET)
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ET{wheelDetails.offset}
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Центральное отверстие
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {wheelDetails.center_bore} мм
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Дополнительные характеристики */}
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Тип диска</TableCell>
                <TableCell>
                  <Chip
                    label={
                      wheelDetails.wheel_type === 'alloy'
                        ? 'Литой'
                        : wheelDetails.wheel_type === 'steel'
                        ? 'Штампованный'
                        : wheelDetails.wheel_type === 'forged'
                        ? 'Кованый'
                        : wheelDetails.wheel_type === 'carbon'
                        ? 'Карбоновый'
                        : wheelDetails.wheel_type
                    }
                    color="primary"
                  />
                </TableCell>
              </TableRow>
              {wheelDetails.material && (
                <TableRow>
                  <TableCell>Материал</TableCell>
                  <TableCell>{wheelDetails.material}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>Цвет</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: wheelDetails.color,
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                      }}
                    />
                    {wheelDetails.color}
                  </Box>
                </TableCell>
              </TableRow>
              {wheelDetails.finish && (
                <TableRow>
                  <TableCell>Покрытие</TableCell>
                  <TableCell>{wheelDetails.finish}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderGeneralSpecifications = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Артикул</TableCell>
              <TableCell>{product.sku}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Бренд</TableCell>
              <TableCell>{product.brand.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Категория</TableCell>
              <TableCell>{product.category.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Тип товара</TableCell>
              <TableCell>
                {product.product_type === 'tire'
                  ? 'Шина'
                  : product.product_type === 'wheel'
                  ? 'Диск'
                  : product.product_type === 'accessory'
                  ? 'Аксессуар'
                  : 'Услуга'}
              </TableCell>
            </TableRow>
            {product.season && (
              <TableRow>
                <TableCell>Сезон</TableCell>
                <TableCell>
                  <Chip
                    label={
                      product.season === 'summer'
                        ? 'Летние'
                        : product.season === 'winter'
                        ? 'Зимние'
                        : 'Всесезонные'
                    }
                    color={
                      product.season === 'summer'
                        ? 'warning'
                        : product.season === 'winter'
                        ? 'info'
                        : 'success'
                    }
                    icon={
                      product.season === 'summer' ? (
                        <Thermostat />
                      ) : product.season === 'winter' ? (
                        <Thermostat />
                      ) : (
                        <Thermostat />
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
            {product.weight && (
              <TableRow>
                <TableCell>Вес</TableCell>
                <TableCell>{product.weight} кг</TableCell>
              </TableRow>
            )}
            {(product.length || product.width || product.height) && (
              <TableRow>
                <TableCell>Размеры (Д×Ш×В)</TableCell>
                <TableCell>
                  {product.length}×{product.width}×{product.height} см
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Количество просмотров</TableCell>
              <TableCell>{product.views_count}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Количество продаж</TableCell>
              <TableCell>{product.sales_count}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      {/* Специфические характеристики */}
      {product.product_type === 'tire' && product.tire_details && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Характеристики шины
          </Typography>
          {renderTireSpecifications(product.tire_details)}
        </Box>
      )}

      {product.product_type === 'wheel' && product.wheel_details && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Характеристики диска
          </Typography>
          {renderWheelSpecifications(product.wheel_details)}
        </Box>
      )}

      {/* Общие характеристики */}
      <Typography variant="h5" gutterBottom>
        Общие характеристики
      </Typography>
      {renderGeneralSpecifications()}

      {/* Дополнительные спецификации из JSON */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Дополнительные характеристики
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ProductSpecifications; 