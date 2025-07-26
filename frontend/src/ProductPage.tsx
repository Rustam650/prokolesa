import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  LinearProgress,
  Alert,
} from '@mui/material';

import { productAPI, Product } from './api';
import UniversalProductPage from './components/UniversalProductPage';
import { mapProductToPage } from './utils/productMapper';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';


const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Прокручиваем страницу вверх при загрузке нового товара
    window.scrollTo(0, 0);
    
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const productData = await productAPI.getProduct(slug);
        setProduct(productData);
      } catch (error) {
        console.error('Ошибка загрузки товара:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    console.log(`[ProductPage] handleAddToCart вызван для товара:`, product);
    if (product?.id) {
      console.log(`[ProductPage] Добавляем товар в корзину: ID=${product.id}, name=${product.name}, type=${product.product_type}`);
      addToCart(product.id, 1, product.product_type as 'tire' | 'wheel');
    } else {
      console.error(`[ProductPage] ❌ Нет product.id:`, product);
    }
  };

  const handleToggleFavorite = () => {
    if (product?.id) {
      toggleFavorite(product.id);
    }
  };



  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Товар не найден</Alert>
      </Container>
    );
  }

  const productPageData = mapProductToPage(product);

  return (
    <UniversalProductPage
      product={productPageData}
      onAddToCart={handleAddToCart}
      onToggleFavorite={handleToggleFavorite}
      onNavigate={(path: string) => navigate(path)}
      isFavorite={product ? isFavorite(product.id) : false}
    />
  );
};

export default ProductPage; 