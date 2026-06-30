import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Wraps every protected page with the Navbar and a consistent background.
 * Renders nested route content via <Outlet /> rather than {children},
 * so individual pages (Dashboard, Tasks, Students, etc.) plug into this
 * shell without each one having to re-import Navbar or redefine the
 * page background itself.
 */
const Layout: React.FC = () => {
  return (
    <div className="p-0 m-0 flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full flex-1 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
