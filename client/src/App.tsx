import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "@/components/Layout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users/index";
import Tasks from "./pages/Tasks";
import Students from "./pages/Students/index";
import Notes from "./pages/Notes";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfilePage from "./pages/Profile";
import { ALL_ROLES } from "./utils/helper";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — outside Layout, so no Navbar renders here */}
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
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[...ALL_ROLES]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={[...ALL_ROLES]}>
                <ProfilePage />
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
              <ProtectedRoute allowedRoles={[...ALL_ROLES]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute allowedRoles={[...ALL_ROLES]}>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
