#This file only needs to be run once, during initial setup
#After this script, next run 'update_database.sql'

#Create the actual database
CREATE DATABASE IF NOT EXISTS template;
USE template;

#Create the database user
CREATE USER IF NOT EXISTS 'template'@'%' IDENTIFIED BY 'pikachu';
GRANT ALL PRIVILEGES ON template.* TO 'template'@'%';