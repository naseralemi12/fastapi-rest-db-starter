create database if not exists ece140;

use ece140;

-- DUMP EVERYTHING... YOU REALLY SHOULDN'T DO THIS!
drop table if exists users;

-- 1. Create the users table
create table if not exists users (
  -- [INSERT CODE HERE]
   id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

-- 2. Insert initial seed records into the table
-- [INSERT CODE HERE]
INSERT INTO users (first_name, last_name)
VALUES ('Adam', 'Alemi'), ('Joe', 'Doe'), ('Bob', 'Logan');