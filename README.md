# **Проект "Таксопарк"**

## **Предварительные требования**

1. Установленный Docker на вашем компьютере.
2. Клиент PostgreSQL для управления базой данных.


## **Начало работы**

### Шаг 1: Сборка образа приложения

Сначала перейдите в директорию _docker-config_: `cd docker-config`.

Затем выполните сборку образа PHP-FPM:
`docker build -t taxi-company-fpm-8.3 .`

Создатч network `docker network create -d bridge tp`

### Шаг 2: Создание контейнера PHP-FPM

Выполните следующую команду для создания и запуска контейнера PHP-FPM: 

`docker run -d --name taxi-company-fpm -p 9097:9000 -v ${pathToProject}/project:/var/www/html -v ${pathToProject}/docker-config/fpm/php-values.ini:/usr/local/etc/php/conf.d/php-values.ini --network tp taxi-company-fpm-8.3`

_Замените ${pathToProject} на фактический путь к вашему проекту._

### Шаг 3: Создание контейнера Nginx

Выполните следующую команду для создания и запуска контейнера Nginx:

`docker run -d --name taxi-company-nginx -p 8089:8089 -v ${pathToProject}/project:/var/www/html -v ${pathToProject}/docker-config/nginx/:/etc/nginx/conf.d --network tp nginx`

_Замените ${pathToProject} на фактический путь к вашему проекту._


### Шаг 4: Создание контейнера PostgreSQL

Выполните следующую команду для создания и запуска контейнера PostgreSQL:

`docker run --name taxi-company-pg -d --network tp -p 5433:5432 -e POSTGRES_PASSWORD=postgres12 postgres:16`

### Шаг 5: Настройка базы данных

После запуска контейнера PostgreSQL подключитесь к базе данных (используя localhost:5433) с помощью клиента PostgreSQL и создайте новую базу данных с именем **taxi_company**.

### Шаг 6: Установка PHP-зависимостей

Подключитесь к контейнеру PHP-FPM:

`docker exec -it taxi-company-fpm bash`

Внутри контейнера перейдите в директорию проекта и установите PHP-зависимости: `composer install`

### Шаг 7: Настройка схемы базы данных

Находясь в контейнере PHP-FPM, выполните следующую команду для создания схемы базы данных:

`php bin/console doctrine:schema:update --force`

### Шаг 8: Установка фронтенд-зависимостей

Все еще находясь в контейнере PHP-FPM, установите фронтенд-зависимости: `npm install`

### Шаг 9: Доступ к приложению

Теперь приложение должно работать. Вы можете получить к нему доступ по следующему адресу:

http://localhost:8089