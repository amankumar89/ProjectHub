import { NavLink, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/students">Students</NavLink>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
