import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Users,
  CheckSquare,
  GraduationCap,
  FileText,
  ArrowRight,
} from "lucide-react";

const ICON_SIZE = 20;

const ALL_CARDS: Record<string, CardItem> = {
  users: {
    icon: <Users size={ICON_SIZE} />,
    title: "Users",
    desc: "Manage all users",
    path: "/users",
    accent: "text-violet-600",
    bgAccent: "bg-violet-50 group-hover:bg-violet-100",
  },
  tasks: {
    icon: <CheckSquare size={ICON_SIZE} />,
    title: "Tasks",
    desc: "Track your tasks",
    path: "/tasks",
    accent: "text-emerald-600",
    bgAccent: "bg-emerald-50 group-hover:bg-emerald-100",
  },
  students: {
    icon: <GraduationCap size={ICON_SIZE} />,
    title: "Students",
    desc: "View student records",
    path: "/students",
    accent: "text-sky-600",
    bgAccent: "bg-sky-50 group-hover:bg-sky-100",
  },
  notes: {
    icon: <FileText size={ICON_SIZE} />,
    title: "Notes",
    desc: "Browse your notes",
    path: "/notes",
    accent: "text-amber-600",
    bgAccent: "bg-amber-50 group-hover:bg-amber-100",
  },
  // profile: {
  //   icon: <User size={ICON_SIZE} />,
  //   title: "Profile",
  //   desc: "View your profile",
  //   path: "/profile",
  //   accent: "text-rose-600",
  //   bgAccent: "bg-rose-50 group-hover:bg-rose-100",
  // },
};

const ROLE_CARDS: Record<string, string[]> = {
  ADMIN: ["users", "tasks", "students", "notes"],
  TEACHER: ["students", "tasks", "notes"],
  STUDENT: ["tasks", "notes"],
  USER: ["tasks", "notes"],
};

const getCards = (role: string): CardItem[] =>
  (ROLE_CARDS[role] ?? []).map((key) => ALL_CARDS[key]);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const cards = getCards(user?.role ?? "");

  return (
    <Wrapper>
      {/* ── Cards ── */}
      <SectionLabel>Quick Access</SectionLabel>
      <Grid>
        {cards.map(({ icon, title, desc, path, accent, bgAccent }) => (
          <Card key={path} onClick={() => navigate(path)}>
            <CardTop>
              <IconBox className={`${bgAccent} ${accent}`}>{icon}</IconBox>
            </CardTop>
            <CardBody>
              <CardTitle>{title}</CardTitle>
              <CardDesc>{desc}</CardDesc>
            </CardBody>
            <CardFooter>
              Go to {title}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Dashboard;

const Wrapper = styled.div.attrs({
  className: "min-h-screen",
})``;

const SectionLabel = styled.p.attrs({
  className:
    "text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4",
})``;

const Grid = styled.div.attrs({
  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
})``;

const Card = styled.div.attrs({
  className:
    "group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer " +
    "hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 hover:border-gray-200 " +
    "transition-all duration-200 flex flex-col justify-between",
})``;

const CardTop = styled.div.attrs({
  className: "flex items-start justify-between mb-5",
})``;

const IconBox = styled.div.attrs({
  className:
    "w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200",
})``;

const CardBody = styled.div.attrs({ className: "flex-1" })``;

const CardTitle = styled.h2.attrs({
  className: "text-base font-semibold text-gray-900 mb-0.5",
})``;

const CardDesc = styled.p.attrs({
  className: "text-sm text-gray-400 mb-5",
})``;

const CardFooter = styled.div.attrs({
  className:
    "flex items-center gap-1.5 text-sm font-semibold text-indigo-500 group-hover:text-indigo-700 transition-colors duration-200",
})``;
