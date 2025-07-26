# 🚗 ProKolesa - Современный интернет-магазин шин и дисков

Современный fullstack интернет-магазин шин и дисков с React PWA фронтендом и Django REST API бэкендом.

## 🚀 Быстрый запуск

### Предварительные требования
- Node.js 16+ 
- Python 3.8+
- npm или yarn

### Установка и запуск

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd prokolesa
```

2. **Установите зависимости:**
```bash
npm run install:all
```

3. **Запустите приложение:**
```bash
npm run dev
```

Это запустит:
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8001
- Django Admin: http://127.0.0.1:8001/admin/ (admin/admin123)

## 📁 Структура проекта

```
prokolesa/
├── frontend/          # React PWA приложение
│   ├── src/
│   │   ├── App.tsx    # Главный компонент
│   │   └── api.ts     # API клиент
│   └── public/
├── backend/           # Django REST API
│   ├── apps/
│   │   ├── products/  # Модели товаров
│   │   └── accounts/  # Пользователи
│   └── prokolesa_backend/
└── package.json       # Корневой package.json
```

## 🛠 Технологии

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Material-UI v5** - UI компоненты
- **Lucide React** - Иконки
- **Axios** - HTTP клиент
- **PWA** - Progressive Web App

### Backend  
- **Django 5.2** - Web фреймворк
- **Django REST Framework** - API
- **SQLite** - База данных
- **CORS Headers** - Cross-origin запросы

## 🎨 Дизайн

Дизайн выполнен в стиле mosautoshina.ru с современными трендами 2025:
- Минималистичные карточки без теней
- Одноцветные иконки
- Красный акцентный цвет (#F72525)
- Чистая типографика Inter
- Адаптивный дизайн

## 📊 API Endpoints

### Товары
- `GET /api/products/` - Список товаров
- `GET /api/products/{slug}/` - Детали товара
- `GET /api/products/bestsellers/` - Хиты продаж
- `GET /api/products/featured/` - Рекомендуемые
- `GET /api/search/suggestions/?q=query` - Автокомплит

### Категории и бренды
- `GET /api/categories/` - Категории
- `GET /api/brands/` - Бренды
- `GET /api/filters/` - Доступные фильтры

## 🗄 База данных

В проекте уже созданы тестовые данные:
- 4 товара (шины Michelin, Continental, диски BBS)
- 2 категории (Летние шины, Литые диски)  
- 3 бренда (Michelin, Continental, BBS)

Для создания дополнительных данных:
```bash
cd backend
python create_test_products.py
```

## 🔧 Команды разработки

```bash
# Запуск только фронтенда
npm run start:frontend

# Запуск только бэкенда  
npm run start:backend

# Сборка фронтенда
npm run build

# Установка всех зависимостей
npm run install:all
```

## 🌟 Ключевые функции

- ✅ **Каталог товаров** с фильтрацией и поиском
- ✅ **Калькулятор подбора** шин по автомобилю
- ✅ **Система рейтингов** и отзывов
- ✅ **Адаптивный дизайн** для всех устройств
- ✅ **PWA поддержка** - можно установить как приложение
- ✅ **REST API** для мобильных приложений
- ✅ **Django Admin** для управления контентом

## 🚀 Roadmap

- [ ] Корзина и оформление заказов
- [ ] Система авторизации
- [ ] Интеграция с платежными системами
- [ ] AR примерка дисков
- [ ] Push уведомления
- [ ] Мобильное приложение

## 📝 Лицензия

MIT License

---

**ProKolesa** - современное решение для продажи шин и дисков онлайн 🚗