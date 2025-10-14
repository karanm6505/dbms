import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { BorrowsPage } from "./pages/BorrowsPage";
import { BooksPage } from "./pages/BooksPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StaffPage } from "./pages/StaffPage";
import { StudentsPage } from "./pages/StudentsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="borrows" element={<BorrowsPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
