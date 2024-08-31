FROM php:8.3-fpm

RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev libpng-dev libfreetype6-dev libssh2-1-dev libssh2-1 libcurl4-openssl-dev
RUN docker-php-ext-install pdo pdo_pgsql pgsql curl zip

# Install the PHP Intl extension
RUN apt-get install -y libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
RUN php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer

ENTRYPOINT ["docker-php-entrypoint"]
WORKDIR /var/www/html
EXPOSE 9000
CMD ["php-fpm"]