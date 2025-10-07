# Library Management System - Database Setup

## Overview
This database contains the full setup for a Library Management System. It is designed to manage books, staff, students, and borrowing records efficiently. The system includes:

1. **Tables** – Stores data about books, staff, students, borrowing records, and genres.  
2. **Functions** – Utility functions such as checking book availability, counting borrowed books, calculating overdue days, and more.  
3. **Triggers** – Automatically update book status, enforce borrowing limits, and maintain genre counts.  
4. **Stored Procedures** – Procedures for adding books, listing active staff, checking borrowed books, and listing database routines.

---

## Files

- `ddl_dml.sql` – Creates all tables and inserts sample data.  
- `functions.sql` – Contains all user-defined functions.  
- `triggers.sql` – Contains all triggers with their business logic.  
- `procedures.sql` – Contains stored procedures for common operations.  
- `library_setup.sql` – Merged file containing all the above, ready to execute in one go.

---

## Database Setup Instructions

1. **Create the database** (if not already created):

```sql
CREATE DATABASE Library_Management_System;
USE Library_Management_System;
```
2. **Execute the full setup** (recommended):

You can execute the merged `.sql` file to create all tables, functions, triggers, and procedures in one step.

**Using terminal/command line:**

```bash
mysql -u your_username -p Library_Management_System < library_setup.sql
```
