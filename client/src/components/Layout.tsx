import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full flex-1 p-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
