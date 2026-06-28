import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import Students from "./pages/Students";
import Notes from "./pages/Notes";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PublicRoute from "./routes/PublicRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* All roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "TEACHER", "STUDENT", "USER"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Admin + Teacher */}
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Students />
            </ProtectedRoute>
          }
        />

        {/* Admin + Teacher + Student */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]}>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
