DELIMITER //

-- Procedure: add_new_book
-- Adds a new book to the book table with status 'available'
-- Parameters: p_title, p_author, p_publisher, p_year_published, p_genre
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

-- Procedure: get_active_staff_list
-- Returns the list of active staff members
DROP PROCEDURE IF EXISTS get_active_staff_list//
CREATE PROCEDURE get_active_staff_list()
BEGIN
    SELECT staff_id, first_name, last_name, position
    FROM staff
    WHERE status = 'active';
END//

-- Procedure: get_books_borrowed_by_student
-- Returns all books borrowed by a specific student
-- Parameter: studentId - ID of the student
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

-- Procedure: get_books_borrowed_with_overdue
-- Returns borrowed books for a student along with overdue days
-- Parameter: studentId - ID of the student
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

-- Procedure: get_currently_borrowed_books
-- Returns all books that are currently issued
DROP PROCEDURE IF EXISTS get_currently_borrowed_books//
CREATE PROCEDURE get_currently_borrowed_books()
BEGIN
    SELECT b.Book_ID, b.Title, b.Author, b.Genre,
           br.Student_ID, br.Staff_ID, br.Issue_Date, br.Due_Date, br.Status
    FROM book b
    JOIN borrow br ON b.Book_ID = br.Book_ID
    WHERE br.Status = 'Issued';
END//

-- Procedure: list_functions
-- Lists all functions in the current database
DROP PROCEDURE IF EXISTS list_functions//
CREATE PROCEDURE list_functions()
BEGIN
    SELECT ROUTINE_NAME
    FROM INFORMATION_SCHEMA.ROUTINES
    WHERE ROUTINE_SCHEMA = 'Library_Management_System'
      AND ROUTINE_TYPE = 'FUNCTION';
END//

-- Procedure: list_procedures
-- Lists all stored procedures in the current database
DROP PROCEDURE IF EXISTS list_procedures//
CREATE PROCEDURE list_procedures()
BEGIN
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_type = 'PROCEDURE'
      AND routine_schema = DATABASE();
END//

-- Procedure: list_triggers
-- Lists all triggers in the current database
DROP PROCEDURE IF EXISTS list_triggers//
CREATE PROCEDURE list_triggers()
BEGIN
    SELECT TRIGGER_NAME, EVENT_MANIPULATION AS Event, EVENT_OBJECT_TABLE AS Table_Name, ACTION_TIMING AS Timing
    FROM information_schema.triggers
    WHERE TRIGGER_SCHEMA = DATABASE();
END//

DELIMITER ;
