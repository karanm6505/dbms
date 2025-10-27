DELIMITER //

-- Function: active_staff_count
-- Returns the total number of staff members whose status is 'active'
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

-- Function: borrowed_count
-- Returns the number of books currently issued to a given student
-- Parameter: stu_id (INT) - ID of the student
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

-- Function: is_book_available
-- Checks if a specific book is available
-- Parameter: bookid (INT) - ID of the book
-- Returns TRUE if the book status is 'Available', FALSE otherwise
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

-- Function: overdueby
-- Returns the number of days a book is overdue
-- Parameter: due_date (DATE) - the due date of the book
DROP FUNCTION IF EXISTS overdueby//
CREATE FUNCTION overdueby(due_date DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(CURDATE(), due_date);
END//

-- Function: total_books_in_genre
-- Returns the total number of books in a given genre
-- Parameter: genre_name (VARCHAR) - name of the genre
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

DELIMITER ;
