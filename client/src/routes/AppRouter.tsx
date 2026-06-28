import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "../pages/Auth";
import Users from "../pages/Users";
import Notes from "../pages/Notes";
import Tasks from "../pages/Tasks";
import Students from "../pages/Students";

import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/students" element={<Students />} />
          </Route>
        </Route>

        {/* Admin-only example */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
