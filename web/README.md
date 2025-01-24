## Streamline Outpatient Care

## Objective
<!-- kamo add -->

## Purpose
<!-- kamo add -->

## Prerequisites

Before running the application, ensure you have the following installed on your local machine:

- [PHP 8.1+](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) (or any other supported database)
- [Laravel 11](https://laravel.com/docs/11.x)

## Installation

Follow these steps to set up the project locally:

### 1. Clone the repository
First, clone the repository to your local machine:

Command:  
```sh
    git clone https://github.com/Crispkreme/project-soc.git
    cd project-soc
    cd web
    npm install
    composer install
```
### 2. Copy the .env file
Command:  
```sh
    cp .env.example .env
    php artisan key:generate
```

### 3. Update the .env file
Command:  
```sh
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
```

### 4. Run command
Command:  
```sh

    # add database migration
    php artisan migrate:fresh --seed

    # terminal 1
    npm run dev

    # terminal 2
    php artisan serve
```