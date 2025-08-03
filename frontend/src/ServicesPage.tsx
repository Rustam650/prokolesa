import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab,
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
        <Box sx={{ py: 3 }}>
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

  // Дополнительные услуги
  const additionalServices = [
    { name: 'Заклейка проколов', price: '350' },
    { name: 'Ремонт боковых порезов', price: '800' },
    { name: 'Мойка колес', price: '100' },
    { name: 'Снятие секреток', price: '500' },
    { name: 'Хранение колес (сезон)', price: '2000' },
    { name: 'Установка датчиков давления', price: '1200' }
  ];

  // Премиум услуги
  const premiumServices = [
    { name: 'Снять/установить', r14r15: '130', r16: '175', r17: '225', r18: '250', r19: '372', r20: '400', r21r22: '450' },
    { name: 'Демонтаж', r14r15: '105', r16: '115', r17: '140', r18: '150', r19: '250', r20: '300', r21r22: '350' },
    { name: 'Монтаж', r14r15: '105', r16: '115', r17: '140', r18: '150', r19: '250', r20: '300', r21r22: '350' },
    { name: 'Электронная балансировка', r14r15: '120', r16: '140', r17: '150', r18: '225', r19: '250', r20: '300', r21r22: '350' },
    { name: 'Комплекс 4 колеса', r14r15: '1050', r16: '1380', r17: '1500', r18: '2000', r19: '2500', r20: '3000', r21r22: '3500' },
    { name: 'Снять/установить 4 колеса', r14r15: '520', r16: '700', r17: '900', r18: '1000', r19: '1250', r20: '1500', r21r22: '1750' }
  ];

  // Правка дисков
  const diskServices = [
    { name: 'Правка литого диска', r13r14: '1500', r15: '1800', r16: '2000', r17: '2200', r18: '2500', r19: '2800', r20: '3000', r21r22: '3500' },
    { name: 'Прокат штампованного диска', r13r14: '800', r15: '900', r16: '1000', r17: '1100', r18: '1200', r19: '1300', r20: '1400', r21r22: '1500' },
    { name: 'Сварка трещин', r13r14: '2000', r15: '2200', r16: '2400', r17: '2600', r18: '2800', r19: '3000', r20: '3200', r21r22: '3500' }
  ];

  // Покраска дисков
  const paintingServices = [
    { type: 'Покраска 1 диска (базовая)', r14: '1500', r15: '1600', r16: '1700', r17: '1800', r18: '1900', r19: '2000', r20: '2100', r21r22: '2200' },
    { type: 'Покраска 1 диска (металлик)', r14: '2000', r15: '2100', r16: '2200', r17: '2300', r18: '2400', r19: '2500', r20: '2600', r21r22: '2700' },
    { type: 'Алмазная проточка', r14: '2500', r15: '2600', r16: '2700', r17: '2800', r18: '2900', r19: '3000', r20: '3100', r21r22: '3200' }
  ];

  const ServiceTable = ({ title, headers, services, keyPrefix }: any) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#E53E3E' }}>
        {title}
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: `200px repeat(${headers.length - 1}, 80px)`,
            minWidth: 500,
            gap: 0,
            border: '1px solid #E2E8F0',
            borderRadius: 1
          }}
        >
          {/* Заголовки */}
          {headers.map((header: string, index: number) => (
            <Box
              key={index}
              sx={{
                p: 1,
                borderRight: index < headers.length - 1 ? '1px solid #E2E8F0' : 'none',
                borderBottom: '1px solid #E2E8F0',
                bgcolor: '#F7FAFC',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textAlign: index === 0 ? 'left' : 'center'
              }}
            >
              {header}
            </Box>
          ))}

          {/* Данные */}
          {services.map((service: any, rowIndex: number) => 
            Object.entries(service).map(([key, value], cellIndex) => (
              <Box
                key={`${rowIndex}-${cellIndex}`}
                sx={{
                  p: 1,
                  borderRight: cellIndex < Object.keys(service).length - 1 ? '1px solid #E2E8F0' : 'none',
                  borderBottom: rowIndex < services.length - 1 ? '1px solid #E2E8F0' : 'none',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  textAlign: cellIndex === 0 ? 'left' : 'center'
                }}
              >
                {typeof value === 'string' && value.match(/^\d+$/) ? `${value} ₽` : String(value)}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );

  const AdditionalServices = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#E53E3E' }}>
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
            border: '1px solid #E2E8F0',
            borderRadius: 1
          }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {service.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#E53E3E' }}>
              {service.price} ₽
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

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
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 3,
          width: '100%',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-flexContainer': {
                justifyContent: { xs: 'flex-start', md: 'center' }
              },
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', md: 160 },
                fontSize: { xs: '0.875rem', md: '1rem' },
                padding: { xs: '6px 12px', md: '12px 16px' }
              }
            }}
          >
            <Tab icon={<Build />} label="Услуги" />
            <Tab icon={<CarRepair />} label="Премиум услуги" />
            <Tab icon={<Settings />} label="Правка дисков" />
            <Tab icon={<Palette />} label="Покраска" />
          </Tabs>
        </Box>

        {/* Основные услуги */}
        <TabPanel value={tabValue} index={0}>
          <ServiceTable 
            title="Услуги для автомобилей 1 класса"
            headers={['Вид работы', 'R10-R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21-R22']}
            services={basicServices}
          />
          <AdditionalServices />
        </TabPanel>

        {/* Премиум услуги */}
        <TabPanel value={tabValue} index={1}>
          <ServiceTable 
            title="Услуги для автомобилей 2-4 классов"
            headers={['Вид работы', 'R14-R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21-R22']}
            services={premiumServices}
          />
        </TabPanel>

        {/* Правка дисков */}
        <TabPanel value={tabValue} index={2}>
          <ServiceTable 
            title="Правка литых дисков / Прокат штампованных дисков"
            headers={['Вид работы', 'R13-R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21-R22']}
            services={diskServices}
          />
        </TabPanel>

        {/* Покраска дисков */}
        <TabPanel value={tabValue} index={3}>
          <ServiceTable 
            title="Покраска дисков и алмазная проточка"
            headers={['Тип работы', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21/R22']}
            services={paintingServices}
          />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default ServicesPage; 