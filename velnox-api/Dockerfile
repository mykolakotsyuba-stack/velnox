FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    sqlite3 \
    libsqlite3-dev \
    zip \
    unzip \
    nginx \
    msmtp \
    msmtp-mta \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (SQLite-based stack)
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd intl zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . /var/www

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Configure msmtp as sendmail replacement (relay to host Postfix via Docker gateway)
RUN printf 'defaults\ntls off\nlogfile /var/log/msmtp.log\n\naccount default\nhost 172.18.0.1\nport 25\nfrom info@velnox.eu\nauto_from off\n' > /etc/msmtprc \
    && chmod 644 /etc/msmtprc \
    && touch /var/log/msmtp.log && chmod 666 /var/log/msmtp.log \
    && echo 'sendmail_path = "/usr/bin/msmtp -t"' > /usr/local/etc/php/conf.d/sendmail.ini

# Provide permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Setup startup script
COPY docker/start.sh /usr/local/bin/start
RUN chmod +x /usr/local/bin/start

EXPOSE 80

CMD ["/usr/local/bin/start"]
