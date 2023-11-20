-- Active: 1700467027899@@127.0.0.1@3306
CREATE DATABASE adminUsers
    DEFAULT CHARACTER SET = 'utf8mb4';

USE adminUsers;

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RoleID INT,
    ProfilePhotoPath VARCHAR(255), -- Assuming the path is a string
    Country VARCHAR(255),
    City VARCHAR(255),
    PhoneNumber VARCHAR(20), -- Assuming a reasonable length for phone numbers
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

CREATE TABLE Role (
    RoleID INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(255) NOT NULL
);
CREATE TABLE Permissions (
    PermissionID INT PRIMARY KEY AUTO_INCREMENT,
    PermissionName VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    RoleID INT,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);
