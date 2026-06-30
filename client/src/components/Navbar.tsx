import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import styled from "styled-components";
import { getInitials, ROLE_ACCENT, ROLE_LABEL } from "@/utils/helper";
import { useLogout } from "@/hooks/useAuth";

interface NavLink {
  to: string;
  label: string;
  roles: Role[];
}

const NAV_LINKS: NavLink[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "TEACHER", "STUDENT", "USER"],
  },
  // { to: "/users", label: "Users", roles: ["ADMIN"] },
  // { to: "/students", label: "Students", roles: ["ADMIN", "TEACHER"] },
  // {
  //   to: "/tasks",
  //   label: "Tasks",
  //   roles: ["ADMIN", "TEACHER", "STUDENT", "USER"],
  // },
  // {
  //   to: "/notes",
  //   label: "Notes",
  //   roles: ["ADMIN", "TEACHER", "STUDENT", "USER"],
  // },
];

const Navbar: React.FC = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const accent = ROLE_ACCENT[user.role];
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandMark
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
          >
            <span className="mark">PH</span>
            <span className="name">ProjectHub</span>
          </BrandMark>

          <nav className="hidden items-center gap-1 md:flex">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? accent.text
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full ${accent.dot}`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ProfileButton
            type="button"
            $ringColor={accent.hex}
            onClick={() => navigate("/user/profile")}
            aria-label="Open your profile"
          >
            {user?.avatarUrl ? (
              <img src={user?.avatarUrl} alt="" className="avatar" />
            ) : (
              <span className="initials">{getInitials(user.name)}</span>
            )}
            <span className="label">{user.name}</span>
          </ProfileButton>

          <span
            className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex ${accent.bg} ${accent.text}`}
          >
            {ROLE_LABEL[user.role]}
          </span>

          <button
            type="button"
            onClick={() => logout()}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav: same links, horizontally scrollable below the main bar */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
        {visibleLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive
                  ? `${accent.bg} ${accent.text}`
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;

const BrandMark = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;

  .mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    font-weight: 700;
    font-size: 0.95rem;
    font-family: "Inter", system-ui, sans-serif;
    letter-spacing: -0.02em;
    transition: transform 150ms ease;
  }

  &:hover .mark {
    transform: translateY(-1px);
  }

  .name {
    font-weight: 700;
    font-size: 1.05rem;
    color: #1e293b;
    font-family: "Inter", system-ui, sans-serif;
    letter-spacing: -0.01em;
  }
`;

const ProfileButton = styled.button<{ $ringColor: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: #f8fafc;
  border-radius: 999px;
  padding: 0.3rem 0.75rem 0.3rem 0.3rem;
  cursor: pointer;
  transition:
    background 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    background: #f1f5f9;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.$ringColor};
    outline-offset: 2px;
  }

  .avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .initials {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    background: #e2e8f0;
    color: #334155;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #334155;
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
