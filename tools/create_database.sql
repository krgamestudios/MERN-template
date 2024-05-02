#use this while debugging
CREATE DATABASE template;
CREATE USER 'template'@'%' IDENTIFIED BY 'pikachu';
GRANT ALL PRIVILEGES ON template.* TO 'template'@'%';

