#This file only needs to be run once, during initial development setup
#This file isnt needed for actual deployment

#Create the development database
CREATE DATABASE IF NOT EXISTS template;
USE template;

#Create the database user
CREATE USER IF NOT EXISTS 'template'@'%' IDENTIFIED BY 'pikachu';
GRANT ALL PRIVILEGES ON template.* TO 'template'@'%';