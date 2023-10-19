DROP DATABASE IF EXISTS staffTail_db;
CREATE DATABASE staffTail_db;

USE staffTail_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary  DECIMAL(8,2),
    department_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);