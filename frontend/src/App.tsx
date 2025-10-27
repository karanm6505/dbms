import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { BorrowsPage } from "./pages/BorrowsPage";
import { BooksPage } from "./pages/BooksPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StaffPage } from "./pages/StaffPage";
import { StudentsPage } from "./pages/StudentsPage";
import { FunctionsPage } from "./pages/FunctionsPage";
import { ProceduresPage } from "./pages/ProceduresPage";
import { TriggersPage } from "./pages/TriggersPage";
import { SchemaReferencePage } from "./pages/SchemaReferencePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="borrows" element={<BorrowsPage />} />
        <Route path="schema">
          <Route index element={<SchemaReferencePage />} />
          <Route path="reference" element={<SchemaReferencePage />} />
          <Route path="functions" element={<FunctionsPage />} />
          <Route path="procedures" element={<ProceduresPage />} />
          <Route path="triggers" element={<TriggersPage />} />
        </Route>
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
