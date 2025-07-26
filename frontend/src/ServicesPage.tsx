import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Tabs, 
  Tab, 
  Chip,
  Alert
} from '@mui/material';
import { Build, CarRepair, Palette, Settings } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`services-tabpanel-${index}`}
      aria-labelledby={`services-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ServicesPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Основные услуги для автомобилей 1 класса
  const basicServices = [
    { name: 'Снять/установить', r10r14: '90', r15: '100', r16: '110', r17: '115', r18: '120', r19: '130', r20: '220', r21r22: '230' },
    { name: 'Демонтаж', r10r14: '75', r15: '95', r16: '90', r17: '100', r18: '110', r19: '115', r20: '150', r21r22: '250' },
    { name: 'Монтаж', r10r14: '70', r15: '75', r16: '90', r17: '100', r18: '110', r19: '115', r20: '150', r21r22: '250' },
    { name: 'Электронная балансировка', r10r14: '90', r15: '100', r16: '110', r17: '115', r18: '135', r19: '140', r20: '225', r21r22: '250' },
    { name: 'Комплекс 4 колеса', r10r14: '1300', r15: '1400', r16: '1600', r17: '1500', r18: '1900', r19: '2000', r20: '3000', r21r22: '4000' },
    { name: 'Снять/установить 4 колеса', r10r14: '360', r15: '400', r16: '440', r17: '460', r18: '480', r19: '520', r20: '900', r21r22: '1000' },
    { name: 'Комплекс 1 колеса', r10r14: '325', r15: '350', r16: '400', r17: '425', r18: '445', r19: '500', r20: '750', r21r22: '1000' },
    { name: 'Балансировка 4 колеса', r10r14: '720', r15: '800', r16: '880', r17: '920', r18: '1020', r19: '1080', r20: '1300', r21r22: '2000' }
  ];

  // Услуги для автомобилей 2-4 классов
  const premiumServices = [
    { name: 'Снять/установить', r14r15: '250', r16: '250', r17: '130', r18: '175', r19: '225', r20: '250', r21r22: '372' },
    { name: 'Демонтаж', r14r15: '200', r16: '200', r17: '105', r18: '115', r19: '140', r20: '150', r21r22: '250' },
    { name: 'Монтаж', r14r15: '100', r16: '100', r17: '105', r18: '115', r19: '140', r20: '150', r21r22: '250' },
    { name: 'Электронная балансировка', r14r15: '200', r16: '200', r17: '120', r18: '140', r19: '150', r20: '225', r21r22: '250' },
    { name: 'Снять/установить 4 колеса', r14r15: '1800', r16: '1800', r17: '1050', r18: '1380', r19: '1500', r20: '2000', r21r22: '2500' },
    { name: 'Снять/установить 4 колеса', r14r15: '1000', r16: '1000', r17: '520', r18: '700', r19: '900', r20: '1000', r21r22: '1250' },
    { name: 'Комплекс 1 колеса', r14r15: '650', r16: '650', r17: '450', r18: '500', r19: '625', r20: '750', r21r22: '1000' },
    { name: 'Комплекс 4х колес', r14r15: '2600', r16: '2600', r17: '1800', r18: '2000', r19: '2500', r20: '3000', r21r22: '4000' }
  ];

  // Правка дисков
  const diskServices = [
    { name: 'Правка литых дисков', r13r14: '500', r15: '600', r16: '700', r17: '800', r18: '900', r19: '1000', r20: '1200', r21r22: '1500' },
    { name: 'Прокат дисков', r13r14: '300', r15: '400', r16: '500', r17: '-', r18: '-', r19: '-', r20: '-', r21r22: '-' }
  ];

  // Дополнительные услуги
  const additionalServices = [
    { name: 'Взрывная подкачка (за 1 колесо)', price: '700' },
    { name: 'Установка 1 вентиля', price: '50' },
    { name: 'Герметизация бортов (за одно колесо)', price: '150' },
    { name: 'Зачистка бортов шлифмашиной (за 1 колесо)', price: '150' },
    { name: 'Бесконтактная мойка колеса (1шт)', price: '50' },
    { name: 'Снятие/установка камеры', price: '700' },
    { name: 'Установка 1 датчика', price: '100' },
    { name: 'Ремонт прокола грибком/заплаткой', price: '300' },
    { name: 'Установка кордовой латки', price: '1000' },
    { name: 'Ремонт 1 бокового пореза (включает вулканизацию и латку)', price: 'от 7500' },
    { name: 'Снятие 1-й секретки', price: 'от 500' },
    { name: 'Нарезание резьбы на 1 шпильке или на 1 ступице', price: '300' }
  ];

  // Покраска дисков
  const paintingServices = [
    { 
      type: 'Литые диски', 
      r14: '1000', r15: '1000', r16: '2500', r17: '10000', r18: '11000', r19: '11500', r20: '15000', r21r22: '15000'
    },
    { 
      type: 'Штампы', 
      r14: '600', r15: '600', r16: '1500', r17: '4000', r18: '-', r19: '-', r20: '-', r21r22: '-'
    },
    { 
      type: 'Алмазная проточка дисков', 
      r14: '7500', r15: '8000', r16: '9000', r17: '9500', r18: '10500', r19: '11000', r20: '12500', r21r22: '14500'
    },
    { 
      type: 'КАНТ', 
      r14: '4000', r15: '4500', r16: '4750', r17: '5250', r18: '5500', r19: '6250', r20: '-', r21r22: '7250'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Заголовок */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{
            fontWeight: 800,
            color: '#191A1B',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Услуги шиномонтажа
          </Typography>
          <Typography variant="h6" sx={{
            color: '#6C757D',
            mb: 3,
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}>
            Полный прайс-лист услуг ProKolesa
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
            <strong>Важно:</strong> RCS и/или Run Flat, и/или низкий профиль (до 40) и/или грязевые шины (для бездорожья): 
            доплата +50% отдельной стоимости монтажа и демонтажа
          </Alert>
        </Box>

        {/* Табы */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab icon={<Build />} label="Основные услуги" />
            <Tab icon={<CarRepair />} label="Премиум услуги" />
            <Tab icon={<Settings />} label="Правка дисков" />
            <Tab icon={<Palette />} label="Покраска" />
          </Tabs>
        </Box>

        {/* Основные услуги */}
        <TabPanel value={tabValue} index={0}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#E53E3E' }}>
                Услуги для автомобилей 1 класса
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F7FAFC' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Вид работы</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R10-R14</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R15</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R16</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R17</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R18</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R19</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R20</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R21-R22</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {basicServices.map((service, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{service.name}</TableCell>
                        <TableCell align="center">{service.r10r14} ₽</TableCell>
                        <TableCell align="center">{service.r15} ₽</TableCell>
                        <TableCell align="center">{service.r16} ₽</TableCell>
                        <TableCell align="center">{service.r17} ₽</TableCell>
                        <TableCell align="center">{service.r18} ₽</TableCell>
                        <TableCell align="center">{service.r19} ₽</TableCell>
                        <TableCell align="center">{service.r20} ₽</TableCell>
                        <TableCell align="center">{service.r21r22} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Дополнительные услуги */}
          <Card elevation={2} sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#E53E3E' }}>
                Дополнительные и ремонтные работы
              </Typography>
                                                           <Box sx={{ 
                 display: 'grid', 
                 gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                 gap: 2 
               }}>
                 {additionalServices.map((service, index) => (
                   <Box key={index} sx={{ 
                     display: 'flex', 
                     justifyContent: 'space-between', 
                     alignItems: 'center',
                     p: 2,
                     bgcolor: '#F7FAFC',
                     borderRadius: 1
                   }}>
                     <Typography variant="body2" sx={{ flex: 1 }}>
                       {service.name}
                     </Typography>
                     <Chip 
                       label={`${service.price} ₽`} 
                       color="primary" 
                       size="small"
                       sx={{ fontWeight: 600 }}
                     />
                   </Box>
                 ))}
               </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Премиум услуги */}
        <TabPanel value={tabValue} index={1}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#E53E3E' }}>
                Услуги для автомобилей 2-4 классов
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#6C757D' }}>
                Согласно внутренней классификации и габаритам
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F7FAFC' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Вид работы</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R14-R15</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R16</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R17</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R18</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R19</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R20</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R21-R22</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {premiumServices.map((service, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{service.name}</TableCell>
                        <TableCell align="center">{service.r14r15} ₽</TableCell>
                        <TableCell align="center">{service.r16} ₽</TableCell>
                        <TableCell align="center">{service.r17} ₽</TableCell>
                        <TableCell align="center">{service.r18} ₽</TableCell>
                        <TableCell align="center">{service.r19} ₽</TableCell>
                        <TableCell align="center">{service.r20} ₽</TableCell>
                        <TableCell align="center">{service.r21r22} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Правка дисков */}
        <TabPanel value={tabValue} index={2}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#E53E3E' }}>
                Правка литых дисков / Прокат штампованных дисков
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F7FAFC' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Вид работы</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R13-R14</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R15</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R16</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R17</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R18</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R19</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R20</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R21-R22</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diskServices.map((service, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{service.name}</TableCell>
                        <TableCell align="center">{service.r13r14} ₽</TableCell>
                        <TableCell align="center">{service.r15} ₽</TableCell>
                        <TableCell align="center">{service.r16} ₽</TableCell>
                        <TableCell align="center">{service.r17}</TableCell>
                        <TableCell align="center">{service.r18}</TableCell>
                        <TableCell align="center">{service.r19}</TableCell>
                        <TableCell align="center">{service.r20}</TableCell>
                        <TableCell align="center">{service.r21r22}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Покраска дисков */}
        <TabPanel value={tabValue} index={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#E53E3E' }}>
                Покраска дисков и алмазная проточка
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F7FAFC' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Тип работы</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R14</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R15</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R16</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R17</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R18</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R19</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R20</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>R21/R22</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paintingServices.map((service, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{service.type}</TableCell>
                        <TableCell align="center">{service.r14} ₽</TableCell>
                        <TableCell align="center">{service.r15} ₽</TableCell>
                        <TableCell align="center">{service.r16} ₽</TableCell>
                        <TableCell align="center">{service.r17} ₽</TableCell>
                        <TableCell align="center">{service.r18}</TableCell>
                        <TableCell align="center">{service.r19}</TableCell>
                        <TableCell align="center">{service.r20}</TableCell>
                        <TableCell align="center">{service.r21r22} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Контактная информация */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Остались вопросы?
          </Typography>
          <Typography variant="body1" sx={{ color: '#6C757D', mb: 2 }}>
            Звоните нам для консультации и записи на обслуживание
          </Typography>
                     <Chip 
             label="+7 988 644 02 44" 
             color="primary" 
             size="medium"
             sx={{ fontSize: '1.1rem', fontWeight: 600 }}
           />
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage; 