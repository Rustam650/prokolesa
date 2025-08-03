"""
URL configuration for prokolesa_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from apps.core.admin_base import admin_site

# Кастомизация админ-панели
admin_site.site_header = 'ProKolesa - Панель управления'
admin_site.site_title = 'ProKolesa Admin'
admin_site.index_title = 'Добро пожаловать в панель управления ProKolesa'

urlpatterns = [
    path('admin/', admin_site.urls),
    path('api/', include('apps.products.urls')),
]

# Обслуживание медиа файлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Интернационализация
urlpatterns += i18n_patterns(
    # Здесь можно добавить URL-паттерны, которые должны поддерживать мультиязычность
)
