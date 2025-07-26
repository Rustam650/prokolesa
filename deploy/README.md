# ProKolesa Deployment Guide

## Развертывание на сервере TimeWeb

### 1. Подготовка сервера

Подключитесь к серверу по SSH:
```bash
ssh root@217.199.252.133
```

Пароль: `yT+E3qPU4KNdg-`

### 2. Запуск автоматического развертывания

Выполните команду для автоматического развертывания:
```bash
curl -sSL https://raw.githubusercontent.com/Rustam650/prokolesa/main/deploy/deploy.sh | bash
```

Или скачайте и запустите вручную:
```bash
wget https://raw.githubusercontent.com/Rustam650/prokolesa/main/deploy/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### 3. Что делает скрипт развертывания:

1. **Обновляет систему** и устанавливает необходимые пакеты
2. **Клонирует репозиторий** с GitHub
3. **Настраивает Python** виртуальное окружение
4. **Собирает React** приложение
5. **Настраивает MySQL** базу данных
6. **Запускает Django** миграции
7. **Настраивает Nginx** веб-сервер
8. **Устанавливает SSL** сертификат Let's Encrypt
9. **Настраивает systemd** сервисы

### 4. После развертывания

Сайт будет доступен по адресам:
- https://prokolesa.pro
- https://www.prokolesa.pro

Django админка:
- https://prokolesa.pro/admin/
- Логин: `prokolesa@mail.ru`
- Пароль: `pro123kolesa45678`

### 5. Управление сервисами

```bash
# Перезапуск Django приложения
sudo systemctl restart gunicorn

# Перезапуск Nginx
sudo systemctl restart nginx

# Проверка статуса
sudo systemctl status gunicorn
sudo systemctl status nginx

# Просмотр логов
sudo journalctl -u gunicorn -f
sudo tail -f /var/log/nginx/error.log
```

### 6. Обновление проекта

Для обновления проекта после изменений в коде:
```bash
cd /var/www/prokolesa
git pull origin main
cd frontend && npm run build
cp -r build/* /var/www/prokolesa/
cd ../backend
sudo -u www-data venv/bin/python manage.py migrate --settings=prokolesa_backend.settings_production
sudo -u www-data venv/bin/python manage.py collectstatic --noinput --settings=prokolesa_backend.settings_production
sudo systemctl restart gunicorn
```

### 7. Мониторинг

- **Логи Django**: `/var/log/prokolesa/django.log`
- **Логи Nginx**: `/var/log/nginx/access.log` и `/var/log/nginx/error.log`
- **Логи Gunicorn**: `sudo journalctl -u gunicorn`

### 8. Резервное копирование

Настройте регулярное резервное копирование базы данных:
```bash
# Создание бэкапа
mysqldump -u prokolesa_user -p prokolesa_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
mysql -u prokolesa_user -p prokolesa_db < backup_file.sql
```

### 9. Безопасность

- SSL сертификат автоматически обновляется через cron
- Файрвол настроен для портов 80, 443, 22
- Все сервисы запускаются под пользователем `www-data`
- База данных доступна только локально

### 10. Troubleshooting

**Если сайт не загружается:**
1. Проверьте статус сервисов: `sudo systemctl status nginx gunicorn`
2. Проверьте логи: `sudo journalctl -u gunicorn -f`
3. Проверьте конфигурацию Nginx: `sudo nginx -t`

**Если SSL не работает:**
1. Проверьте сертификат: `sudo certbot certificates`
2. Обновите сертификат: `sudo certbot renew`

**Если база данных недоступна:**
1. Проверьте MySQL: `sudo systemctl status mysql`
2. Проверьте подключение: `mysql -u prokolesa_user -p prokolesa_db` 