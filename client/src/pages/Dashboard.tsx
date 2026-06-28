import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";

interface CardItem {
  icon: string;
  title: string;
  desc: string;
  path: string;
}

const ADMIN_CARDS: CardItem[] = [
  { icon: "👤", title: "Users", desc: "Manage all users", path: "/users" },
  { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
  {
    icon: "🎓",
    title: "Students",
    desc: "View student records",
    path: "/students",
  },
  { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
];

const TEACHER_CARDS: CardItem[] = [
  {
    icon: "🎓",
    title: "Students",
    desc: "View student records",
    path: "/students",
  },
  { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
  { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
];

const STUDENT_CARDS: CardItem[] = [
  { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
  { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
  { icon: "👤", title: "Profile", desc: "View your profile", path: "/profile" },
];

const getCards = (role: string): CardItem[] => {
  if (role === "ADMIN") return ADMIN_CARDS;
  if (role === "TEACHER") return TEACHER_CARDS;
  if (role === "STUDENT") return STUDENT_CARDS;
  return [];
};

const Wrapper = styled.div.attrs({
  className: "min-h-screen bg-gray-50 p-8",
})``;
const Header = styled.div.attrs({
  className: "flex items-center justify-between mb-8",
})``;
const Title = styled.h1.attrs({
  className: "text-3xl font-bold text-gray-800",
})``;
const Subtitle = styled.p.attrs({ className: "text-gray-500 mt-1" })``;
const Grid = styled.div.attrs({
  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
})``;
const Card = styled.div.attrs({
  className:
    "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200",
})``;
const CardIcon = styled.div.attrs({ className: "text-3xl mb-4" })``;
const CardTitle = styled.h2.attrs({
  className: "text-lg font-semibold text-gray-800 mb-1",
})``;
const CardDesc = styled.p.attrs({ className: "text-sm text-gray-400 mb-4" })``;
const CardCTA = styled.div.attrs({
  className: "flex items-center gap-1 text-indigo-500 font-medium text-sm",
})``;
const LogoutBtn = styled.button.attrs({
  className:
    "text-sm text-red-400 hover:text-red-600 font-medium transition-colors",
})``;

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const cards = getCards(user?.role ?? "");

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>Dashboard</Title>
          <Subtitle>
            Welcome, {user?.name} · {user?.role}
          </Subtitle>
        </div>
        <LogoutBtn onClick={logout}>Logout</LogoutBtn>
      </Header>

      <Grid>
        {cards.map(({ icon, title, desc, path }) => (
          <Card key={path} onClick={() => navigate(path)}>
            <CardIcon>{icon}</CardIcon>
            <CardTitle>{title}</CardTitle>
            <CardDesc>{desc}</CardDesc>
            <CardCTA>
              Go to {title} <span>→</span>
            </CardCTA>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Dashboard;
