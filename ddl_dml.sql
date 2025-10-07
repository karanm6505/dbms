-- ===========================================
--  Library Management Database
--  Tables: student, staff, book, borrow, computer
-- ===========================================

-- Drop existing tables if they exist (optional cleanup)
DROP TABLE IF EXISTS borrow;
DROP TABLE IF EXISTS computer;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS student;

-- ===========================================
-- 1. Student Table
-- ===========================================
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

-- ===========================================
-- 2. Staff Table
-- ===========================================
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

-- ===========================================
-- 3. Book Table
-- ===========================================
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
(26, 'Database Systems', 'Korth', 'McGraw-Hill', 2020, 'Computer Science', 'available');

-- ===========================================
-- 4. Computer Table
-- ===========================================
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
(1, 'Lab-A1', 'Windows 11', 'Dell Optiplex', 'In use', 1, 103),
(2, 'Lab-A2', 'Ubuntu 22.04', 'HP EliteDesk', 'Working', NULL, 103),
(3, 'Lab-B1', 'Windows 10', 'Lenovo ThinkCentre', 'Faulty', NULL, 103),
(4, 'Lab-C1', 'Windows 11', 'Asus ExpertCenter', 'Working', 2, 102),
(5, 'Lab-C2', 'Ubuntu 20.04', 'Acer Veriton', 'In use', 3, 103);

-- ===========================================
-- 5. Borrow Table
-- ===========================================
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
(1, 1, 2, 101, '2025-09-10', '2025-09-25', 'Returned'),
(2, 3, 4, 104, '2025-09-15', '2025-09-30', 'Issued'),
(3, 5, 9, 101, '2025-08-01', '2025-08-15', 'Returned'),
(4, 2, 5, 102, '2025-09-28', '2025-10-10', 'Issued'),
(5, 4, 14, 101, '2025-09-05', '2025-09-20', 'Returned'),
(6, 1, 7, 105, '2025-09-12', '2025-09-27', 'Issued'),
(7, 3, 12, 101, '2025-09-22', '2025-10-05', 'Issued'),
(8, 5, 20, 104, '2025-09-25', '2025-10-10', 'Issued'),
(9, 101, 1, 5, '2025-10-07', '2025-10-21', 'returned'),
(10, 3, 5, 1, '2025-10-07', '2025-10-21', 'Issued');
