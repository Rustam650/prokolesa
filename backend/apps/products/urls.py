from django.urls import path
from . import views, api_views

app_name = 'products'

urlpatterns = [
    # Новые унифицированные API endpoints
    path('products/', api_views.ProductListAPIView.as_view(), name='products_list'),
    path('products/featured/', api_views.featured_products, name='featured_products'),
    path('products/bestsellers/', api_views.bestseller_products, name='bestseller_products'),
    path('products/new/', api_views.new_products, name='new_products'),
    path('products/by-id/<int:pk>/', api_views.ProductByIdAPIView.as_view(), name='product_by_id'),
    path('products/<slug:slug>/', api_views.ProductDetailAPIView.as_view(), name='product_detail'),
    path('search/smart/', api_views.smart_search, name='smart_search'),
    
    # Категории
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    
    # Бренды
    path('brands/', views.BrandListView.as_view(), name='brands'),
    
    # Старые endpoints (для совместимости)
    path('tires/', views.TireProductListView.as_view(), name='tires'),
    path('wheels/', views.WheelProductListView.as_view(), name='wheels'),
    path('search/', views.search_products, name='search'),
    
    # Тестирование API
    path('test/', views.test_api_view, name='test_api'),
]
