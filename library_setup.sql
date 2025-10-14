-- ================================
-- Library Management System Setup
-- ================================

CREATE DATABASE IF NOT EXISTS Library_Management_System;
USE Library_Management_System;

-- ================================
-- 1. Tables and Sample Data
-- ================================
SOURCE ddl_dml.sql;

-- ================================
-- 2. Functions
-- ================================
SOURCE functions.sql;

-- ================================
-- 3. Triggers
-- ================================
SOURCE triggers.sql;

-- ================================
-- 4. Stored Procedures
-- ================================
SOURCE procedures.sql;
