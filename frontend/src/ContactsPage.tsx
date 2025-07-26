import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Divider,
  Paper
} from '@mui/material';
import {
  Phone,
  LocationOn,
  Schedule,
  Email,
  Directions,
  WhatsApp
} from '@mui/icons-material';
import YandexMap from './components/YandexMap';

const ContactsPage = () => {
  const handleCall = () => {
    window.open('tel:+79886440244', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/79886440244', '_blank');
  };

  const handleDirections = () => {
    window.open('https://maps.yandex.ru/?ll=46.707786,43.834928&z=16&text=Кизляр%2C%20ул.%20Набережная%2C%20107', '_blank');
  };

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Заголовок */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h2" sx={{
            fontWeight: 800,
            color: '#191A1B',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            Контакты
          </Typography>
          <Typography variant="h6" sx={{
            color: '#6C757D',
            fontSize: { xs: '1rem', md: '1.25rem' },
            maxWidth: 600,
            mx: 'auto'
          }}>
            Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь вам с выбором шин и дисков!
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Основная контактная информация */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  <span style={{ color: '#F72525' }}>Pro</span>
                  <span style={{ color: '#191A1B' }}>Kolesa</span>
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#6C757D', 
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}>
                  Интернет-магазин шин и дисков с доставкой по всей России. 
                  Работаем с 2020 года, более 10 000 довольных клиентов.
                </Typography>

                <Grid container spacing={3}>
                  {/* Телефон */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: '#F72525', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Phone sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#191A1B' }}>
                          Телефон
                        </Typography>
                        <Typography 
                          variant="h6" 
                          component="a"
                          href="tel:+79886440244"
                          sx={{ 
                            color: '#F72525', 
                            fontWeight: 600,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': { color: '#E01E1E' }
                          }}
                        >
                          +7 988 644 02 44
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Адрес */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: '#2196F3', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <LocationOn sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#191A1B' }}>
                          Адрес
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6C757D' }}>
                          Кизляр, ул. Набережная, 107
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Режим работы */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: '#4CAF50', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Schedule sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#191A1B' }}>
                          Режим работы
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6C757D' }}>
                          Пн-Вс: 9:00-21:00
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontSize: '0.875rem' }}>
                          Без выходных и праздников
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: '#FF9800', 
                        borderRadius: '50%', 
                        p: 1, 
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Email sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#191A1B' }}>
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6C757D' }}>
                          info@prokolesa.ru
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Кнопки действий */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={handleCall}
                    sx={{
                      bgcolor: '#F72525',
                      '&:hover': { bgcolor: '#d41e1e' },
                      borderRadius: 2,
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Позвонить
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    onClick={handleWhatsApp}
                    sx={{
                      bgcolor: '#25D366',
                      '&:hover': { bgcolor: '#20b858' },
                      borderRadius: 2,
                      px: 3,
                      py: 1.5
                    }}
                  >
                    WhatsApp
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Directions />}
                    onClick={handleDirections}
                    sx={{
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      '&:hover': { 
                        borderColor: '#1976D2',
                        bgcolor: 'rgba(33, 150, 243, 0.04)'
                      },
                      borderRadius: 2,
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Построить маршрут
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Дополнительная информация */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Преимущества */}
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#191A1B', 
                  mb: 2 
                }}>
                  Почему выбирают нас?
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#F72525', 
                      borderRadius: '50%', 
                      mr: 2 
                    }} />
                    <Typography variant="body2" sx={{ color: '#6C757D' }}>
                      Более 10 000 товаров в наличии
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#F72525', 
                      borderRadius: '50%', 
                      mr: 2 
                    }} />
                    <Typography variant="body2" sx={{ color: '#6C757D' }}>
                      Доставка по всей России
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#F72525', 
                      borderRadius: '50%', 
                      mr: 2 
                    }} />
                    <Typography variant="body2" sx={{ color: '#6C757D' }}>
                      Гарантия качества
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#F72525', 
                      borderRadius: '50%', 
                      mr: 2 
                    }} />
                    <Typography variant="body2" sx={{ color: '#6C757D' }}>
                      Профессиональная консультация
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Время ответа */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: 'linear-gradient(135deg, #F72525 0%, #d41e1e 100%)',
              background: 'linear-gradient(135deg, #F72525 0%, #d41e1e 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Быстрый ответ
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Отвечаем на звонки и сообщения в течение 5 минут в рабочее время
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Карта */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mt: 4
        }}>
          <CardContent sx={{ p: 0 }}>
            <YandexMap 
              address="Кизляр, ул. Набережная, 107"
              coordinates={[43.834928, 46.707786]}
              height={400}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ContactsPage; 