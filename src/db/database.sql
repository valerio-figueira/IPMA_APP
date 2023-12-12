CREATE TABLE CONTACT (
contact_id INT AUTO_INCREMENT NOT NULL,
user_id INT UNIQUE NOT NULL,
phone_number VARCHAR(11) DEFAULT NULL,
residential_phone VARCHAR(10) DEFAULT NULL,
email VARCHAR(50) UNIQUE DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_CONTACT PRIMARY KEY (contact_id),
CONSTRAINT FK_USER_CONTACT FOREIGN KEY (user_id) REFERENCES USER (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE LOCATION (
location_id INT AUTO_INCREMENT NOT NULL,
user_id INT UNIQUE NOT NULL,
address VARCHAR(50) DEFAULT NULL,
number INT DEFAULT NULL,
neighborhood VARCHAR(30) DEFAULT NULL,
city VARCHAR(30) DEFAULT NULL,
zipcode VARCHAR(10) DEFAULT NULL,
state VARCHAR(2) DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_LOCATION PRIMARY KEY (location_id),
CONSTRAINT FK_USER_LOCATION FOREIGN KEY (user_id) REFERENCES USER (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE DOCUMENT (
document_id INT AUTO_INCREMENT NOT NULL,
user_id INT UNIQUE NOT NULL,
cpf VARCHAR(11) NOT NULL UNIQUE,
identity VARCHAR(10) NOT NULL UNIQUE,
issue_date DATE DEFAULT NULL,
health_card VARCHAR(15) DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_DOCUMENT PRIMARY KEY (document_id),
CONSTRAINT FK_USER_DOCUMENT FOREIGN KEY (user_id) REFERENCES USER (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE USER (
user_id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(60) NOT NULL,
gender ENUM('MASCULINO', 'FEMININO', 'OUTRO') NOT NULL,
marital_status VARCHAR(10) DEFAULT NULL,
birth_date DATE DEFAULT NULL,
father_name VARCHAR(50) DEFAULT NULL,
mother_name VARCHAR(50) DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_USER PRIMARY KEY (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE HOLDER (
holder_id INT AUTO_INCREMENT NOT NULL UNIQUE,
user_id INT NOT NULL UNIQUE,
subscription_number INT DEFAULT NULL,
status ENUM('ATIVO(A)', 'APOSENTADO(A)', 'LICENÇA') NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_HOLDER PRIMARY KEY (holder_id),
CONSTRAINT FK_USER_HOLDER FOREIGN KEY (user_id) REFERENCES USER (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE DEPENDENT (
dependent_id INT AUTO_INCREMENT NOT NULL UNIQUE,
user_id INT NOT NULL UNIQUE,
holder_id INT NOT NULL,
relationship_degree VARCHAR(11) DEFAULT NULL,
CONSTRAINT PK_DEPENDENT PRIMARY KEY (dependent_id),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_USER_DEPENDENT FOREIGN KEY (user_id) REFERENCES USER (user_id),
CONSTRAINT FK_HOLDER_DEPENDENT FOREIGN KEY (holder_id) REFERENCES HOLDER (holder_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE SOCIAL_SECURITY_TEAM (
sst_member_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
role VARCHAR(30) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_USER_SST FOREIGN KEY (user_id) REFERENCES USER (user_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE POST_AUTHORS (
post_author_id INT AUTO_INCREMENT PRIMARY KEY,
sst_author_id INT NOT NULL,
post_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_SST_POST_AUTHOR FOREIGN KEY (sst_author_id) REFERENCES SOCIAL_SECURITY_TEAM (sst_member_id),
CONSTRAINT FK_BLOG_POST_AUTHOR FOREIGN KEY(post_id) REFERENCES BLOG_POSTS (post_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE BLOG_POSTS (
post_id INT AUTO_INCREMENT PRIMARY KEY,
author_id INT,
title VARCHAR(70) NOT NULL,
content TEXT NOT NULL,
category VARCHAR(50),
tags VARCHAR(255),
views INT DEFAULT 0,
last_edit TIMESTAMP DEFAULT NULL,
last_editor_id INT DEFAULT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_SST_BLOG_POSTS FOREIGN KEY (author_id) REFERENCES SOCIAL_SECURITY_TEAM (sst_member_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE AUTHENTICATION (
authentication_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL REFERENCES USER(user_id),
user_id INT NOT NULL UNIQUE,
hierarchy_id INT NOT NULL,
username VARCHAR(30) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
user_photo VARCHAR(50) DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_USER_AUTHENTICATION FOREIGN KEY (user_id) REFERENCES USER (user_id),
CONSTRAINT FK_HIERARCHY_AUTHENTICATION FOREIGN KEY (hierarchy_id) REFERENCES ACCESS_HIERARCHY (hierarchy_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE ACCESS_HIERARCHY (
hierarchy_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
level_name VARCHAR(30) NOT NULL,
parent_level_id INT DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_PARENT_LEVEL_HIERARCHY FOREIGN KEY (parent_level_id) REFERENCES ACCESS_HIERARCHY (hierarchy_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE AGREEMENT (
agreement_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
agreement_name VARCHAR(20) NOT NULL,
description VARCHAR(255) DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET UTF8;

CREATE TABLE MEMBER (
member_id INT NOT NULL AUTO_INCREMENT,
holder_id INT NOT NULL,
dependent_id INT DEFAULT NULL,
agreement_id INT NOT NULL,
agreement_card VARCHAR(17) UNIQUE,
active BOOLEAN NOT NULL DEFAULT TRUE,
exclusion_date DATE DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_MEMBER PRIMARY KEY (member_id),
CONSTRAINT FK_HOLDER_MEMBER FOREIGN KEY (holder_id) REFERENCES HOLDER (holder_id),
CONSTRAINT FK_DEPENDENT_MEMBER FOREIGN KEY (dependent_id) REFERENCES DEPENDENT (dependent_id),
CONSTRAINT FK_AGREEMENT_MEMBER FOREIGN KEY (agreement_id) REFERENCES AGREEMENT (agreement_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE ORTHO_HISTORY (
ortho_history_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
member_id INT NOT NULL,
reference_month INT NOT NULL CHECK (reference_month >= 1 AND reference_month <= 12),
reference_year INT NOT NULL CHECK (reference_year >= 2015 AND reference_year <= 2100),
has_orthodontic_device BOOLEAN NOT NULL,
ortho_value DECIMAL(10, 2),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT FK_MEMBER_ORTHO_HISTORY FOREIGN KEY (member_id) REFERENCES MEMBER (member_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE MONTHLY_FEE (
monthly_fee_id INT NOT NULL AUTO_INCREMENT,
member_id INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
reference_month INT NOT NULL CHECK (reference_month >= 1 AND reference_month <= 12),
reference_year INT NOT NULL CHECK (reference_year >= 2015 AND reference_year <= 2100),
reference_date DATE NOT NULL,
payment_date DATE DEFAULT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_MONTHLY_FEE PRIMARY KEY (monthly_fee_id),
CONSTRAINT FK_MEMBER_MONTHLY_FEE FOREIGN KEY (member_id) REFERENCES MEMBER (member_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE INSTALLMENT (
installment_id INT NOT NULL AUTO_INCREMENT,
member_id INT NOT NULL,
installment_amount DECIMAL(7,2) NOT NULL,
installment_count INT NOT NULL,
total_amount DECIMAL(7,2) NOT NULL,
start_date DATE NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_INSTALLMENT PRIMARY KEY (installment_id),
CONSTRAINT FK_MEMBER_INSTALLMENT FOREIGN KEY (member_id) REFERENCES MEMBER (member_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE PAYMENTS (
payment_id INT NOT NULL AUTO_INCREMENT,
installment_id INT NOT NULL,
paid_amount DECIMAL(7,2) NOT NULL,
transaction_date DATE DEFAULT NULL,
status ENUM('PENDENTE', 'PAGO', 'ANULADO') NOT NULL DEFAULT 'PENDENTE',
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_PAYMENT PRIMARY KEY (payment_id),
CONSTRAINT FK_INSTALLMENT_PAYMENT FOREIGN KEY (installment_id) REFERENCES INSTALLMENT (installment_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE APPOINTMENTS (
appointment_id INT AUTO_INCREMENT NOT NULL,
member_id INT NOT NULL,
consultant_name VARCHAR(60) NOT NULL,
description VARCHAR(30) NOT NULL,
appointment_amount DECIMAL(7,2) NOT NULL,
appointment_date DATE DEFAULT NULL,
reference_month INT NOT NULL CHECK (reference_month >= 1 AND reference_month <= 12),
reference_year INT NOT NULL CHECK (reference_year >= 2015 AND reference_year <= 2100),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT PK_APPOINTMENT PRIMARY KEY (appointment_id),
CONSTRAINT FK_MEMBER_APPOINTMENT FOREIGN KEY (member_id) REFERENCES MEMBER (member_id)
) DEFAULT CHARSET UTF8;

CREATE TABLE DOCTOR (
doctor_id INT AUTO_INCREMENT PRIMARY KEY,
provider_code INT NOT NULL,
doctor_name VARCHAR(60) NOT NULL,
speciality VARCHAR(60) NOT NULL,
location VARCHAR(40) NOT NULL,
zip_code VARCHAR(10) NOT NULL,
address VARCHAR(60) NOT NULL,
neighborhood VARCHAR(30) NOT NULL,
phone_number VARCHAR(40) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET UTF8;