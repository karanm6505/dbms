export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  yearPublished: number;
  genre: string;
  status: string;
}

export interface StaffMember {
  staffId: number;
  firstName: string;
  lastName: string;
  position: string;
  status: string;
}

export interface BorrowRecord {
  borrowId: number;
  studentName: string;
  bookTitle: string;
  staffName: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export interface DashboardSummary {
  totalStudents: number;
  activeStudents: number;
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalStaff: number;
}

export interface SchemaTable {
  name: string;
}

export interface DbRoutine {
  name: string;
}

export interface DbTrigger {
  name: string;
  event: string;
  table: string;
  timing: string;
}

export interface ProcedureExecutionResult {
  name: string;
  rows: Record<string, unknown>[];
}

export interface FunctionExecutionResult {
  name: string;
  result: unknown;
}
