CREATE DATABASE IF NOT EXISTS Library_Management_System;
USE Library_Management_System;

SOURCE /docker-entrypoint-initdb.d/sql/ddl_dml.sql;
SOURCE /docker-entrypoint-initdb.d/sql/functions.sql;
SOURCE /docker-entrypoint-initdb.d/sql/triggers.sql;
SOURCE /docker-entrypoint-initdb.d/sql/procedures.sql;
