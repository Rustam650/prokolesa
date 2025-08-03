#!/bin/bash

# ProKolesa Deployment Script for TimeWeb Server
# Run this script as root on the server

set -e  # Exit on any error

echo "🚀 Starting ProKolesa deployment..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
apt install -y python3 python3-pip python3-venv nginx mysql-server mysql-client \
    libmysqlclient-dev pkg-config redis-server git curl nodejs npm \
    certbot python3-certbot-nginx supervisor

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/prokolesa
mkdir -p /var/log/prokolesa

# Clone or update repository
echo "📥 Cloning/updating repository..."
if [ -d "/var/www/prokolesa/.git" ]; then
    cd /var/www/prokolesa
    git pull origin main
else
    git clone https://github.com/Rustam650/prokolesa.git /var/www/prokolesa
    cd /var/www/prokolesa
fi


# Set permissions
chown -R www-data:www-data /var/www/prokolesa
chown -R www-data:www-data /var/log/prokolesa

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd /var/www/prokolesa/backend
sudo -u www-data python3 -m venv venv
sudo -u www-data venv/bin/pip install --upgrade pip
sudo -u www-data venv/bin/pip install -r requirements.txt
sudo -u www-data venv/bin/pip install gunicorn mysqlclient redis

# Setup Node.js and build frontend
echo "⚛️ Building frontend..."
cd /var/www/prokolesa/frontend
sudo -u www-data npm install
sudo -u www-data npm run build

# Copy built files to web root
cp -r build/* /var/www/prokolesa/

# Setup MySQL database
echo "🗄️ Setting up MySQL database..."
mysql -e "CREATE DATABASE IF NOT EXISTS prokolesa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'prokolesa_user'@'localhost' IDENTIFIED BY 'ProKolesa2024!Strong';"
mysql -e "GRANT ALL PRIVILEGES ON prokolesa_db.* TO 'prokolesa_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Set environment variables
echo "🔧 Setting up environment variables..."
cat > /var/www/prokolesa/backend/.env << EOF
DJANGO_SETTINGS_MODULE=prokolesa_backend.settings_production
DB_NAME=prokolesa_db
DB_USER=prokolesa_user
DB_PASSWORD=ProKolesa2024!Strong
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
EOF

# Run Django migrations
echo "🗄️ Running Django migrations..."
cd /var/www/prokolesa/backend
sudo -u www-data venv/bin/python manage.py migrate --settings=prokolesa_backend.settings_production
sudo -u www-data venv/bin/python manage.py collectstatic --noinput --settings=prokolesa_backend.settings_production

# Create Django superuser (optional)
echo "👤 Creating Django superuser..."
sudo -u www-data venv/bin/python manage.py shell --settings=prokolesa_backend.settings_production << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='prokolesa@mail.ru').exists():
    User.objects.create_superuser('prokolesa@mail.ru', 'prokolesa@mail.ru', 'pro123kolesa45678')
    print("Superuser created successfully")
else:
    print("Superuser already exists")
EOF

# Setup systemd services
echo "⚙️ Setting up systemd services..."
cp /var/www/prokolesa/deploy/gunicorn.socket /etc/systemd/system/
cp /var/www/prokolesa/deploy/gunicorn.service /etc/systemd/system/

systemctl daemon-reload
systemctl enable gunicorn.socket
systemctl start gunicorn.socket
systemctl enable gunicorn.service

# Setup Nginx (temporary without SSL)
echo "🌐 Setting up Nginx..."
cat > /etc/nginx/sites-available/prokolesa << EOF
server {
    listen 80;
    server_name prokolesa.pro www.prokolesa.pro;
    
    root /var/www/prokolesa;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://unix:/run/gunicorn/gunicorn.sock;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /admin/ {
        proxy_pass http://unix:/run/gunicorn/gunicorn.sock;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /static/ {
        alias /var/www/prokolesa/backend/staticfiles/;
    }
    
    location /media/ {
        alias /var/www/prokolesa/backend/media/;
    }
}
EOF

ln -sf /etc/nginx/sites-available/prokolesa /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start services
echo "🚀 Starting services..."
systemctl restart gunicorn
systemctl restart nginx
systemctl enable nginx

# Setup Let's Encrypt SSL
echo "🔒 Setting up SSL certificate..."
certbot --nginx -d prokolesa.pro -d www.prokolesa.pro --non-interactive --agree-tos --email admin@prokolesa.pro

# Update Nginx with SSL configuration
cp /var/www/prokolesa/deploy/nginx.conf /etc/nginx/sites-available/prokolesa
systemctl restart nginx

# Setup automatic SSL renewal
echo "🔄 Setting up automatic SSL renewal..."
crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | crontab -

# Final permissions check
chown -R www-data:www-data /var/www/prokolesa
chmod -R 755 /var/www/prokolesa

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should now be available at https://prokolesa.pro"
echo "🔧 Django admin: https://prokolesa.pro/admin/"
echo "📧 Admin credentials: prokolesa@mail.ru / pro123kolesa45678"
EOF 