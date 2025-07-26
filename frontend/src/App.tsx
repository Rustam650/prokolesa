import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import Layout from './Layout';
import HomePage from './HomePage';
import CatalogPage from './CatalogPage';
import ProductPage from './ProductPage';
import SearchResultsPage from './SearchResultsPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import FavoritesPage from './FavoritesPage';

import ServicesPage from './ServicesPage';
import ContactsPage from './ContactsPage';

// Тема в стиле mosautoshina.ru
const theme = createTheme({
  palette: {
    primary: {
      main: '#F72525', // Красный цвет ProKolesa
    },
    secondary: {
      main: '#191A1B', // Темный цвет
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#191A1B',
      secondary: '#6C757D',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#191A1B',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#191A1B',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#191A1B',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(247, 37, 37, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
  
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 