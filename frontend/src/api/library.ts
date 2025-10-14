import { apiClient } from "./client";
import {
  Book,
  BorrowRecord,
  DashboardSummary,
  StaffMember,
  Student,
} from "../types";

type StudentResponse = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
};

type BookResponse = {
  book_id: number;
  title: string;
  author: string;
  publisher: string;
  year_published: number;
  genre: string;
  status: string;
};

type StaffResponse = {
  staff_id: number;
  first_name: string;
  last_name: string;
  position: string;
  status: string;
};

type BorrowRecordResponse = {
  borrow_id: number;
  student_name: string;
  book_title: string;
  staff_name: string;
  issue_date: string;
  due_date: string;
  status: string;
};

type DashboardResponse = {
  total_students: number;
  active_students: number;
  total_books: number;
  available_books: number;
  borrowed_books: number;
  total_staff: number;
};

const mapStudent = (item: StudentResponse): Student => ({
  studentId: item.student_id,
  firstName: item.first_name,
  lastName: item.last_name,
  email: item.email,
  status: item.status,
});

const mapBook = (item: BookResponse): Book => ({
  bookId: item.book_id,
  title: item.title,
  author: item.author,
  publisher: item.publisher,
  yearPublished: item.year_published,
  genre: item.genre,
  status: item.status,
});

const mapStaff = (item: StaffResponse): StaffMember => ({
  staffId: item.staff_id,
  firstName: item.first_name,
  lastName: item.last_name,
  position: item.position,
  status: item.status,
});

const mapBorrowRecord = (item: BorrowRecordResponse): BorrowRecord => ({
  borrowId: item.borrow_id,
  studentName: item.student_name,
  bookTitle: item.book_title,
  staffName: item.staff_name,
  issueDate: item.issue_date,
  dueDate: item.due_date,
  status: item.status,
});

const mapDashboard = (item: DashboardResponse): DashboardSummary => ({
  totalStudents: item.total_students,
  activeStudents: item.active_students,
  totalBooks: item.total_books,
  availableBooks: item.available_books,
  borrowedBooks: item.borrowed_books,
  totalStaff: item.total_staff,
});

export const libraryApi = {
  async getStudents(): Promise<Student[]> {
    const data = await apiClient.get<StudentResponse[]>("/api/students");
    return data.map(mapStudent);
  },

  async createStudent(payload: Omit<Student, "studentId">): Promise<Student> {
    const data = await apiClient.post<StudentResponse>("/api/students", {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      status: payload.status,
    });

    return mapStudent(data);
  },

  async getBooks(): Promise<Book[]> {
    const data = await apiClient.get<BookResponse[]>("/api/books");
    return data.map(mapBook);
  },

  async getAvailableBooks(): Promise<Book[]> {
    const data = await apiClient.get<BookResponse[]>("/api/books/available");
    return data.map(mapBook);
  },

  async getStaff(): Promise<StaffMember[]> {
    const data = await apiClient.get<StaffResponse[]>("/api/staff");
    return data.map(mapStaff);
  },

  async getBorrowRecords(): Promise<BorrowRecord[]> {
    const data = await apiClient.get<BorrowRecordResponse[]>("/api/borrows");
    return data.map(mapBorrowRecord);
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const data = await apiClient.get<DashboardResponse>(
      "/api/dashboard/stats"
    );
    return mapDashboard(data);
  },
};
