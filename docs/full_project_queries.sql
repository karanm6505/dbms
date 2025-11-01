-- =============================================================
-- Library Management System - Consolidated SQL Bundle
-- Includes schema (DDL), seed data (DML), functions, triggers,
-- stored procedures, and complex queries required by the project.
-- =============================================================

DROP DATABASE IF EXISTS Library_Management_System;
CREATE DATABASE Library_Management_System;
USE Library_Management_System;

-- =============================================================
-- 0. Users Table (Authentication)
-- =============================================================
DROP TABLE IF EXISTS borrow;
DROP TABLE IF EXISTS computer;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS genre_count;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, role) VALUES
('karanm6505@gmail.com', '$2a$10$K9sm5Sh5c6T852H9ohmmLu08px1fncihv.a6aOFYn3wKyhkCdnaeq', 'admin');

-- =============================================================
-- 1. Student Table
-- =============================================================
CREATE TABLE student (
    Student_ID INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Email VARCHAR(100),
    Status VARCHAR(20)
);

INSERT INTO student (Student_ID, First_Name, Last_Name, Email, Status) VALUES
(1, 'John', 'Smith', 'john.smith@example.com', 'Active'),
(2, 'Emily', 'Johnson', 'emily.johnson@example.com', 'Active'),
(3, 'Michael', 'Brown', 'michael.brown@example.com', 'Active'),
(4, 'Sarah', 'Davis', 'sarah.davis@example.com', 'Active'),
(5, 'David', 'Wilson', 'david.wilson@example.com', 'Active'),
(6, 'Jessica', 'Taylor', 'jessica.taylor@example.com', 'Active'),
(7, 'Daniel', 'Anderson', 'daniel.anderson@example.com', 'Active'),
(8, 'Laura', 'Thomas', 'laura.thomas@example.com', 'Inactive'),
(9, 'James', 'White', 'james.white@example.com', 'Active'),
(10, 'Karen', 'Harris', 'karen.harris@example.com', 'Active');

-- =============================================================
-- 2. Staff Table
-- =============================================================
CREATE TABLE staff (
    Staff_ID INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Position VARCHAR(50),
    Status VARCHAR(20)
);

INSERT INTO staff (Staff_ID, First_Name, Last_Name, Position, Status) VALUES
(1, 'Anna', 'Clark', 'Librarian', 'Active'),
(2, 'Robert', 'Miller', 'Supervisor', 'Active'),
(3, 'Laura', 'Taylor', 'Technician', 'Active'),
(4, 'James', 'Anderson', 'Librarian', 'On leave'),
(5, 'Karen', 'Thomas', 'Assistant', 'Active');

-- =============================================================
-- 3. Book Table
-- =============================================================
CREATE TABLE book (
    Book_ID INT PRIMARY KEY,
    Title VARCHAR(100),
    Author VARCHAR(100),
    Publisher VARCHAR(100),
    Year_Published YEAR,
    Genre VARCHAR(50),
    Status VARCHAR(20)
);

INSERT INTO book (Book_ID, Title, Author, Publisher, Year_Published, Genre, Status) VALUES
(1, 'Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', 2022, 'Computer Science', 'Available'),
(2, 'Database System Concepts', 'Abraham Silberschatz', 'McGraw Hill', 2020, 'Database Systems', 'Borrowed'),
(3, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Pearson', 2021, 'AI', 'Available'),
(4, 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2018, 'Programming', 'Available'),
(5, 'Operating System Concepts', 'Abraham Silberschatz', 'Wiley', 2022, 'Operating Systems', 'Issued'),
(6, 'The Pragmatic Programmer', 'Andrew Hunt', 'Addison-Wesley', 2021, 'Programming', 'Available'),
(7, 'Design Patterns', 'Erich Gamma', 'Addison-Wesley', 2020, 'Software Engineering', 'Borrowed'),
(8, 'Computer Networks', 'Andrew S. Tanenbaum', 'Pearson', 2021, 'Networking', 'Available'),
(9, 'Data Structures and Algorithms in Python', 'Michael T. Goodrich', 'Wiley', 2022, 'Computer Science', 'Borrowed'),
(10, 'Python Crash Course', 'Eric Matthes', 'No Starch Press', 2023, 'Programming', 'Available'),
(11, 'Artificial Intelligence with Python', 'Prateek Joshi', 'Packt', 2021, 'AI', 'Available'),
(12, 'Deep Learning', 'Ian Goodfellow', 'MIT Press', 2019, 'AI', 'Borrowed'),
(13, 'Machine Learning', 'Tom Mitchell', 'McGraw Hill', 2020, 'AI', 'Available'),
(14, 'Python for Data Analysis', 'Wes McKinney', 'OReilly', 2022, 'Data Science', 'Available'),
(15, 'Hands-On Machine Learning with Scikit-Learn', 'Aurélien Géron', 'OReilly', 2021, 'AI', 'Borrowed'),
(16, 'Introduction to Computer Security', 'Matt Bishop', 'Pearson', 2020, 'Security', 'Available'),
(17, 'Computer Organization and Design', 'David A. Patterson', 'Morgan Kaufmann', 2019, 'Computer Architecture', 'Available'),
(18, 'Programming Pearls', 'Jon Bentley', 'Addison-Wesley', 1999, 'Programming', 'Available'),
(19, 'Algorithms Unlocked', 'Thomas H. Cormen', 'MIT Press', 2013, 'Computer Science', 'Available'),
(20, 'Introduction to Compiler Design', 'Alfred V. Aho', 'Pearson', 2020, 'Compiler', 'Borrowed'),
(21, 'Modern Operating Systems', 'Andrew Tanenbaum', 'Pearson', 2021, 'Operating Systems', 'Available'),
(22, 'The Art of Computer Programming', 'Donald Knuth', 'Addison-Wesley', 2011, 'Algorithms', 'Available'),
(23, 'Effective Java', 'Joshua Bloch', 'Addison-Wesley', 2018, 'Programming', 'Borrowed'),
(24, 'Computer Graphics: Principles and Practice', 'Foley et al.', 'Pearson', 2019, 'Graphics', 'Available'),
(25, 'Introduction to Artificial Intelligence', 'Wolfgang Ertel', 'Springer', 2020, 'AI', 'Available'),
(26, 'Database Systems', 'Korth', 'McGraw-Hill', 2020, 'Computer Science', 'Available');

-- =============================================================
-- 4. Auxiliary Genre Count Table
-- =============================================================
CREATE TABLE genre_count (
    Genre VARCHAR(50) PRIMARY KEY,
    Count INT NOT NULL DEFAULT 0
);

-- =============================================================
-- 5. Computer Table
-- =============================================================
CREATE TABLE computer (
    Computer_ID INT PRIMARY KEY,
    Location VARCHAR(50),
    OS VARCHAR(50),
    Model VARCHAR(100),
    Status VARCHAR(20),
    Assigned_Student_ID INT,
    Assigned_Staff_ID INT,
    FOREIGN KEY (Assigned_Student_ID) REFERENCES student(Student_ID),
    FOREIGN KEY (Assigned_Staff_ID) REFERENCES staff(Staff_ID)
);

INSERT INTO computer (Computer_ID, Location, OS, Model, Status, Assigned_Student_ID, Assigned_Staff_ID) VALUES
(1, 'Lab-A1', 'Windows 11', 'Dell Optiplex', 'In use', 1, 3),
(2, 'Lab-A2', 'Ubuntu 22.04', 'HP EliteDesk', 'Working', NULL, 3),
(3, 'Lab-B1', 'Windows 10', 'Lenovo ThinkCentre', 'Faulty', NULL, 3),
(4, 'Lab-C1', 'Windows 11', 'Asus ExpertCenter', 'Working', 2, 2),
(5, 'Lab-C2', 'Ubuntu 20.04', 'Acer Veriton', 'In use', 3, 3);

-- =============================================================
-- 6. Borrow Table
-- =============================================================
CREATE TABLE borrow (
    Borrow_ID INT PRIMARY KEY,
    Student_ID INT,
    Book_ID INT,
    Staff_ID INT,
    Issue_Date DATE,
    Due_Date DATE,
    Status VARCHAR(20),
    FOREIGN KEY (Student_ID) REFERENCES student(Student_ID),
    FOREIGN KEY (Book_ID) REFERENCES book(Book_ID),
    FOREIGN KEY (Staff_ID) REFERENCES staff(Staff_ID)
);

INSERT INTO borrow (Borrow_ID, Student_ID, Book_ID, Staff_ID, Issue_Date, Due_Date, Status) VALUES
(1, 1, 2, 1, '2025-09-10', '2025-09-25', 'Returned'),
(2, 3, 4, 4, '2025-09-15', '2025-09-30', 'Issued'),
(3, 5, 9, 1, '2025-08-01', '2025-08-15', 'Returned'),
(4, 2, 5, 2, '2025-09-28', '2025-10-10', 'Issued'),
(5, 4, 14, 1, '2025-09-05', '2025-09-20', 'Returned'),
(6, 1, 7, 5, '2025-09-12', '2025-09-27', 'Issued'),
(7, 3, 12, 1, '2025-09-22', '2025-10-05', 'Issued'),
(8, 5, 20, 4, '2025-09-25', '2025-10-10', 'Issued'),
(9, 6, 1, 5, '2025-10-07', '2025-10-21', 'Returned'),
(10, 3, 5, 1, '2025-10-07', '2025-10-21', 'Issued');

-- =============================================================
-- 7. Stored Functions
-- =============================================================
DELIMITER //

DROP FUNCTION IF EXISTS active_staff_count//
CREATE FUNCTION active_staff_count()
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM staff
        WHERE status = 'active'
    );
END//

DROP FUNCTION IF EXISTS borrowed_count//
CREATE FUNCTION borrowed_count(stu_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE cnt INT;

    SELECT COUNT(*) INTO cnt
    FROM BORROW
    WHERE Student_ID = stu_id
      AND Status = 'Issued';

    RETURN cnt;
END//

DROP FUNCTION IF EXISTS is_book_available//
CREATE FUNCTION is_book_available(bookid INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE s VARCHAR(20);

    SELECT Status INTO s
    FROM BOOK
    WHERE Book_ID = bookid
    LIMIT 1;

    IF s = 'Available' THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END//

DROP FUNCTION IF EXISTS overdueby//
CREATE FUNCTION overdueby(due_date DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(CURDATE(), due_date);
END//

DROP FUNCTION IF EXISTS total_books_in_genre//
CREATE FUNCTION total_books_in_genre(genre_name VARCHAR(50))
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM book
        WHERE genre = genre_name
    );
END//

-- =============================================================
-- 8. Triggers
-- =============================================================
DROP TRIGGER IF EXISTS after_borrow_insert//
CREATE TRIGGER after_borrow_insert
AFTER INSERT ON borrow
FOR EACH ROW
BEGIN
    UPDATE book
    SET Status = 'Issued'
    WHERE Book_ID = NEW.Book_ID;
END//

DROP TRIGGER IF EXISTS after_borrow_return//
CREATE TRIGGER after_borrow_return
AFTER UPDATE ON borrow
FOR EACH ROW
BEGIN
    IF NEW.Status != 'Issued' THEN
        UPDATE book
        SET Status = 'Available'
        WHERE Book_ID = NEW.Book_ID;
    END IF;
END//

DROP TRIGGER IF EXISTS after_book_insert//
CREATE TRIGGER after_book_insert
AFTER INSERT ON book
FOR EACH ROW
BEGIN
    INSERT INTO genre_count (Genre, Count)
    VALUES (NEW.Genre, 1)
    ON DUPLICATE KEY UPDATE Count = Count + 1;
END//

DROP TRIGGER IF EXISTS before_book_delete//
CREATE TRIGGER before_book_delete
BEFORE DELETE ON book
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Issued' OR OLD.Status = 'Borrowed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete a book that is currently issued or borrowed';
    END IF;
END//

DROP TRIGGER IF EXISTS after_staff_insert//
CREATE TRIGGER after_staff_insert
AFTER INSERT ON staff
FOR EACH ROW
BEGIN
    IF NEW.Status IS NULL OR NEW.Status = '' THEN
        UPDATE staff
        SET Status = 'Active'
        WHERE Staff_ID = NEW.Staff_ID;
    END IF;
END//

DROP TRIGGER IF EXISTS before_borrow_limit//
CREATE TRIGGER before_borrow_limit
BEFORE INSERT ON borrow
FOR EACH ROW
BEGIN
    DECLARE borrow_count INT;

    SELECT COUNT(*)
    INTO borrow_count
    FROM borrow
    WHERE Student_ID = NEW.Student_ID
      AND Status = 'Issued';

    IF borrow_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot borrow more than 3 books at a time';
    END IF;
END//

-- =============================================================
-- 9. Stored Procedures
-- =============================================================
DROP PROCEDURE IF EXISTS add_new_book//
CREATE PROCEDURE add_new_book(
    IN p_title VARCHAR(255),
    IN p_author VARCHAR(255),
    IN p_publisher VARCHAR(255),
    IN p_year_published INT,
    IN p_genre VARCHAR(50)
)
BEGIN
    INSERT INTO book (Title, Author, Publisher, Year_Published, Genre, Status)
    VALUES (p_title, p_author, p_publisher, p_year_published, p_genre, 'available');
END//

DROP PROCEDURE IF EXISTS get_active_staff_list//
CREATE PROCEDURE get_active_staff_list()
BEGIN
    SELECT staff_id, first_name, last_name, position
    FROM staff
    WHERE status = 'active';
END//

DROP PROCEDURE IF EXISTS get_books_borrowed_by_student//
CREATE PROCEDURE get_books_borrowed_by_student(IN studentId INT)
BEGIN
    SELECT 
        B.Book_ID,
        B.Title,
        B.Author,
        B.Publisher,
        B.Year_Published,
        B.Genre,
        Br.Issue_Date,
        Br.Due_Date,
        Br.Status AS Borrow_Status
    FROM BOOK B
    JOIN BORROW Br ON B.Book_ID = Br.Book_ID
    WHERE Br.Student_ID = studentId
      AND TRIM(Br.Status) IN ('not returned', 'issued', 'borrowed');
END//

DROP PROCEDURE IF EXISTS get_books_borrowed_with_overdue//
CREATE PROCEDURE get_books_borrowed_with_overdue(IN studentId INT)
BEGIN
    SELECT 
        B.Title AS Book_Title,
        overdueby(Br.Due_Date) AS Overdue
    FROM BOOK B
    JOIN BORROW Br ON B.Book_ID = Br.Book_ID
    WHERE Br.Student_ID = studentId
      AND TRIM(Br.Status) IN ('not returned', 'issued', 'borrowed');
END//

DROP PROCEDURE IF EXISTS get_currently_borrowed_books//
CREATE PROCEDURE get_currently_borrowed_books()
BEGIN
    SELECT b.Book_ID, b.Title, b.Author, b.Genre,
           br.Student_ID, br.Staff_ID, br.Issue_Date, br.Due_Date, br.Status
    FROM book b
    JOIN borrow br ON b.Book_ID = br.Book_ID
    WHERE br.Status = 'Issued';
END//

DROP PROCEDURE IF EXISTS list_functions//
CREATE PROCEDURE list_functions()
BEGIN
    SELECT ROUTINE_NAME
    FROM INFORMATION_SCHEMA.ROUTINES
    WHERE ROUTINE_SCHEMA = 'Library_Management_System'
      AND ROUTINE_TYPE = 'FUNCTION';
END//

DROP PROCEDURE IF EXISTS list_procedures//
CREATE PROCEDURE list_procedures()
BEGIN
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_type = 'PROCEDURE'
      AND routine_schema = DATABASE();
END//

DROP PROCEDURE IF EXISTS list_triggers//
CREATE PROCEDURE list_triggers()
BEGIN
    SELECT TRIGGER_NAME, EVENT_MANIPULATION AS Event, EVENT_OBJECT_TABLE AS Table_Name, ACTION_TIMING AS Timing
    FROM information_schema.triggers
    WHERE TRIGGER_SCHEMA = DATABASE();
END//

DELIMITER ;

-- =============================================================
-- 10. Sample Analytical Queries
-- =============================================================
-- Total active staff
SELECT active_staff_count() AS active_staff;

-- Borrowed books per student (uses stored function)
SELECT student.Student_ID, student.First_Name, borrowed_count(student.Student_ID) AS active_borrows
FROM student;

-- Genre availability summary (aggregation)
SELECT Genre, total_books_in_genre(Genre) AS total_titles
FROM book
GROUP BY Genre
ORDER BY total_titles DESC;

-- Join + nested query: overdue books by student
SELECT s.First_Name, s.Last_Name, b.Title, br.Due_Date
FROM student s
JOIN borrow br ON s.Student_ID = br.Student_ID
JOIN book b ON br.Book_ID = b.Book_ID
WHERE br.Status = 'Issued'
  AND br.Due_Date < CURDATE();

-- Diagnostics: list registered triggers via stored procedure
CALL list_triggers();
