import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  IconButton
} from '@mui/material';
import {
  Phone,
  LocationOn as MapPin,
  AccessTime as Clock,
  ShoppingCart,
  Favorite as Heart,
  Menu,
  Build,
  ContactPhone,
  ViewModule as CatalogIcon,
} from '@mui/icons-material';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import AccessibleDrawer from './components/AccessibleDrawer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: favoritesCount } = useFavorites();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActivePage = (path: string) => {
    if (path === '/catalog') {
      return location.pathname === '/catalog' || location.pathname.startsWith('/catalog/');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Основная шапка */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
            {/* Логотип */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' }, color: '#191A1B' }}
              >
                <Menu />
              </IconButton>
              
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  <Box component="span" sx={{ color: '#F72525' }}>Pro</Box>
                  <Box component="span" sx={{ 
                    color: isActivePage('/') ? '#F72525' : '#191A1B',
                    transition: 'color 0.2s'
                  }}>Kolesa</Box>
                </Typography>
              </Link>
            </Box>

            {/* Навигация (скрыта на мобильных) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Link to="/catalog" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  '&:hover .nav-icon': { color: '#F72525' },
                  '&:hover .nav-text': { color: '#F72525' }
                }}>
                  <CatalogIcon className="nav-icon" sx={{ 
                    color: isActivePage('/catalog') ? '#F72525' : '#191A1B', 
                    fontSize: 20, 
                    transition: 'color 0.2s' 
                  }} />
                  <Typography className="nav-text" variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: isActivePage('/catalog') ? '#F72525' : '#191A1B', 
                    transition: 'color 0.2s'
                  }}>
                    Каталог
                  </Typography>
                </Box>
              </Link>
              
              <Link to="/services" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  '&:hover .nav-icon': { color: '#F72525' },
                  '&:hover .nav-text': { color: '#F72525' }
                }}>
                  <Build className="nav-icon" sx={{ 
                    color: isActivePage('/services') ? '#F72525' : '#191A1B', 
                    fontSize: 20, 
                    transition: 'color 0.2s' 
                  }} />
                  <Typography className="nav-text" variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: isActivePage('/services') ? '#F72525' : '#191A1B', 
                    transition: 'color 0.2s'
                  }}>
                    Услуги
                  </Typography>
                </Box>
              </Link>
              

              <Link to="/contacts" style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  '&:hover .nav-icon': { color: '#F72525' },
                  '&:hover .nav-text': { color: '#F72525' }
                }}>
                  <ContactPhone className="nav-icon" sx={{ 
                    color: isActivePage('/contacts') ? '#F72525' : '#191A1B', 
                    fontSize: 20, 
                    transition: 'color 0.2s' 
                  }} />
                  <Typography className="nav-text" variant="body1" sx={{ 
                    fontWeight: 600, 
                    color: isActivePage('/contacts') ? '#F72525' : '#191A1B', 
                    transition: 'color 0.2s'
                  }}>
                    Контакты
                  </Typography>
                </Box>
              </Link>
            </Box>

            {/* Контакты и действия */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'right' }}>
                <Typography 
                  variant="h6" 
                  component="a"
                  href="tel:+79886440244"
                  sx={{ 
                    color: '#191A1B', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#F72525' }
                  }}
                >
                  +7 988 644 02 44
                </Typography>
              </Box>
              
              <IconButton 
                component={Link} 
                to="/favorites" 
                sx={{ 
                  color: '#191A1B', 
                  p: { xs: 0.5, md: 1 },
                  position: 'relative',
                  '&:hover': {
                    '& .favorites-circle': {
                      backgroundColor: '#F72525',
                      color: 'white',
                    }
                  }
                }}
              >
                <Badge 
                  badgeContent={favoritesCount > 0 ? favoritesCount : null} 
                  color="secondary" 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      bgcolor: '#F72525', 
                      color: 'white',
                      fontSize: '0.75rem',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '50%'
                    } 
                  }}
                >
                  <Box
                    className="favorites-circle"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: favoritesCount > 0 ? '#F72525' : '#F5F5F5',
                      color: favoritesCount > 0 ? 'white' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      border: favoritesCount > 0 ? '2px solid #F72525' : '2px solid #E0E0E0',
                    }}
                  >
                    <Heart fontSize="small" />
                  </Box>
                </Badge>
              </IconButton>

              
              <IconButton 
                component={Link} 
                to="/cart" 
                sx={{ 
                  color: '#191A1B', 
                  p: { xs: 0.5, md: 1 },
                  position: 'relative',
                  '&:hover': {
                    '& .cart-circle': {
                      backgroundColor: '#F72525',
                      color: 'white',
                    }
                  }
                }}
              >
                <Badge 
                  badgeContent={cartCount > 0 ? cartCount : null} 
                  color="secondary" 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      bgcolor: '#F72525', 
                      color: 'white',
                      fontSize: '0.75rem',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '50%'
                    } 
                  }}
                >
                  <Box
                    className="cart-circle"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: cartCount > 0 ? '#F72525' : '#F5F5F5',
                      color: cartCount > 0 ? 'white' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      border: cartCount > 0 ? '2px solid #F72525' : '2px solid #E0E0E0',
                    }}
                  >
                    <ShoppingCart fontSize="small" />
                  </Box>
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>



      {/* Мобильное меню */}
      <AccessibleDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        title="Главное меню"
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: '#F72525',
            color: 'white'
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
            ProKolesa
          </Typography>
        </Box>
        
        <List>
          <ListItem component={Link} to="/catalog" onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <CatalogIcon />
            </ListItemIcon>
            <ListItemText primary="Каталог" />
          </ListItem>
          
          <ListItem component={Link} to="/services" onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Build />
            </ListItemIcon>
            <ListItemText primary="Услуги" />
          </ListItem>
          

          <ListItem component={Link} to="/contacts" onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ContactPhone />
            </ListItemIcon>
            <ListItemText primary="Контакты" />
          </ListItem>
        </List>
        
        <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography 
            variant="h6" 
            component="a"
            href="tel:+79886440244"
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': { color: 'rgba(255,255,255,0.8)' }
            }}
          >
            +7 988 644 02 44
          </Typography>
        </Box>
      </AccessibleDrawer>

      {/* Основной контент */}
      <Box component="main" sx={{ minHeight: 'calc(100vh - 400px)' }}>
        {children}
      </Box>

      {/* Футер */}
      <Box sx={{ bgcolor: '#191A1B', color: 'white', py: { xs: 3, md: 4 }, mt: { xs: 3, md: 4 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#F72525', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                ProKolesa
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Интернет-магазин шин и дисков с доставкой по всей России
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone fontSize="small" />
                <Typography 
                  variant="body2" 
                  component="a"
                  href="tel:+79886440244"
                  sx={{ 
                    color: 'inherit',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#F72525' }
                  }}
                >
                  +7 988 644 02 44
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin fontSize="small" />
                <Typography variant="body2">Кизляр, ул. Набережная, 107</Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Каталог
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to="/catalog/tire" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ '&:hover': { color: '#F72525' } }}>
                    Летние шины
                  </Typography>
                </Link>
                <Link to="/catalog/tire" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ '&:hover': { color: '#F72525' } }}>
                    Зимние шины
                  </Typography>
                </Link>
                <Link to="/catalog/tire" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ '&:hover': { color: '#F72525' } }}>
                    Всесезонные шины
                  </Typography>
                </Link>
                <Link to="/catalog/wheel" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ '&:hover': { color: '#F72525' } }}>
                    Литые диски
                  </Typography>
                </Link>
                <Link to="/catalog/wheel" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ '&:hover': { color: '#F72525' } }}>
                    Штампованные диски
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Информация
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#F72525' } }}>
                  О компании
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#F72525' } }}>
                  Доставка и оплата
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#F72525' } }}>
                  Гарантия
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#F72525' } }}>
                  Контакты
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Режим работы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Clock fontSize="small" />
                <Typography variant="body2">Пн-Вс: 9:00-21:00</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Без выходных и праздников
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3, borderColor: '#495057' }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            textAlign: 'center',
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}>
            © 2025 ProKolesa. Все права защищены.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Layout; 