DELIMITER //

-- Trigger: after_borrow_insert
-- Updates the book status to 'Issued' when a new borrow record is inserted
DROP TRIGGER IF EXISTS after_borrow_insert//
CREATE TRIGGER after_borrow_insert
AFTER INSERT ON borrow
FOR EACH ROW
BEGIN
    UPDATE book
    SET Status = 'Issued'
    WHERE Book_ID = NEW.Book_ID;
END//

-- Trigger: after_borrow_return
-- Updates the book status to 'Available' when a borrowed book is returned (status changes)
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

-- Trigger: after_book_insert
-- Updates genre_count table whenever a new book is inserted
DROP TRIGGER IF EXISTS after_book_insert//
CREATE TRIGGER after_book_insert
AFTER INSERT ON book
FOR EACH ROW
BEGIN
    INSERT INTO genre_count (Genre, Count)
    VALUES (NEW.Genre, 1)
    ON DUPLICATE KEY UPDATE Count = Count + 1;
END//

-- Trigger: before_book_delete
-- Prevents deletion of a book if it is currently issued or borrowed
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

-- Trigger: after_staff_insert
-- Ensures new staff have 'Active' status if none provided
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

-- Trigger: before_borrow_limit
-- Prevents a student from borrowing more than 3 books at a time
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

DELIMITER ;
