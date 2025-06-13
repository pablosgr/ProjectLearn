FROM php:8.2-apache

WORKDIR /var/www/html

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql

# Copy PHP scripts
COPY . .

EXPOSE 80
