import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckSquare,
  GraduationCap,
  FileText,
  User,
  LogOut,
  ArrowRight,
  LayoutDashboard,
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
  profile: {
    icon: <User size={ICON_SIZE} />,
    title: "Profile",
    desc: "View your profile",
    path: "/profile",
    accent: "text-rose-600",
    bgAccent: "bg-rose-50 group-hover:bg-rose-100",
  },
};

const ROLE_CARDS: Record<string, string[]> = {
  ADMIN: ["users", "tasks", "students", "notes"],
  TEACHER: ["students", "tasks", "notes"],
  STUDENT: ["tasks", "notes", "profile"],
};

const getCards = (role: string): CardItem[] =>
  (ROLE_CARDS[role] ?? []).map((key) => ALL_CARDS[key]);

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700 border-violet-200",
  TEACHER: "bg-sky-100 text-sky-700 border-sky-200",
  STUDENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const cards = getCards(user?.role ?? "");
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Wrapper>
      {/* ── Header ── */}
      <Header>
        <HeaderLeft>
          <LogoBox>
            <LayoutDashboard size={18} />
          </LogoBox>
          <TitleBlock>
            <Title>Dashboard</Title>
            <Subtitle>
              Welcome back,{" "}
              <span className="font-medium text-gray-600">{user?.name}</span>
            </Subtitle>
          </TitleBlock>
        </HeaderLeft>

        <HeaderRight>
          <Link to="/user/profile">
            <AvatarBadge>
              <AvatarCircle>{initials}</AvatarCircle>
              <AvatarName>{user?.name}</AvatarName>
              <Badge
                variant="outline"
                className={`text-xs font-semibold px-2 py-0.5 ${ROLE_BADGE[user?.role ?? ""] ?? ""}`}
              >
                {user?.role}
              </Badge>
            </AvatarBadge>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors rounded-xl"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </HeaderRight>
      </Header>

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
  className: "min-h-screen bg-[#F7F8FC] p-6 md:p-10",
})``;

const Header = styled.div.attrs({
  className:
    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10",
})``;

const HeaderLeft = styled.div.attrs({
  className: "flex items-center gap-3",
})``;

const LogoBox = styled.div.attrs({
  className:
    "w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200",
})``;

const TitleBlock = styled.div.attrs({ className: "flex flex-col" })``;

const Title = styled.h1.attrs({
  className: "text-2xl font-bold text-gray-900 tracking-tight leading-none",
})``;

const Subtitle = styled.p.attrs({
  className: "text-sm text-gray-400 mt-0.5",
})``;

const HeaderRight = styled.div.attrs({
  className: "flex items-center gap-3",
})``;

const AvatarBadge = styled.div.attrs({
  className:
    "hidden sm:flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm " +
    "hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 hover:border-gray-200 " +
    "transition-all duration-200",
})``;

const AvatarCircle = styled.div.attrs({
  className:
    "w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center",
})``;

const AvatarName = styled.span.attrs({
  className: "text-sm font-medium text-gray-700",
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

// import React from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { useLogout } from "../hooks/useAuth";

// const ADMIN_CARDS: CardItem[] = [
//   { icon: "👤", title: "Users", desc: "Manage all users", path: "/users" },
//   { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
//   {
//     icon: "🎓",
//     title: "Students",
//     desc: "View student records",
//     path: "/students",
//   },
//   { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
// ];

// const TEACHER_CARDS: CardItem[] = [
//   {
//     icon: "🎓",
//     title: "Students",
//     desc: "View student records",
//     path: "/students",
//   },
//   { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
//   { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
// ];

// const STUDENT_CARDS: CardItem[] = [
//   { icon: "✅", title: "Tasks", desc: "Track your tasks", path: "/tasks" },
//   { icon: "📝", title: "Notes", desc: "Browse your notes", path: "/notes" },
//   { icon: "👤", title: "Profile", desc: "View your profile", path: "/profile" },
// ];

// const getCards = (role: string): CardItem[] => {
//   if (role === "ADMIN") return ADMIN_CARDS;
//   if (role === "TEACHER") return TEACHER_CARDS;
//   if (role === "STUDENT") return STUDENT_CARDS;
//   return [];
// };

// const Wrapper = styled.div.attrs({
//   className: "min-h-screen bg-gray-50 p-8",
// })``;
// const Header = styled.div.attrs({
//   className: "flex items-center justify-between mb-8",
// })``;
// const Title = styled.h1.attrs({
//   className: "text-3xl font-bold text-gray-800",
// })``;
// const Subtitle = styled.p.attrs({ className: "text-gray-500 mt-1" })``;
// const Grid = styled.div.attrs({
//   className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
// })``;
// const Card = styled.div.attrs({
//   className:
//     "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200",
// })``;
// const CardIcon = styled.div.attrs({ className: "text-3xl mb-4" })``;
// const CardTitle = styled.h2.attrs({
//   className: "text-lg font-semibold text-gray-800 mb-1",
// })``;
// const CardDesc = styled.p.attrs({ className: "text-sm text-gray-400 mb-4" })``;
// const CardCTA = styled.div.attrs({
//   className: "flex items-center gap-1 text-indigo-500 font-medium text-sm",
// })``;
// const LogoutBtn = styled.button.attrs({
//   className:
//     "text-sm text-red-400 hover:text-red-600 font-medium transition-colors",
// })``;

// const Dashboard: React.FC = () => {
//   const { user } = useAuthStore();
//   const { mutate } = useLogout();
//   const navigate = useNavigate();

//   const cards = getCards(user?.role ?? "");

//   return (
//     <Wrapper>
//       <Header>
//         <div>
//           <Title>Dashboard</Title>
//           <Subtitle>
//             Welcome, {user?.name} · {user?.role}
//           </Subtitle>
//         </div>
//         <LogoutBtn onClick={() => mutate()}>Logout</LogoutBtn>
//       </Header>

//       <Grid>
//         {cards.map(({ icon, title, desc, path }) => (
//           <Card key={path} onClick={() => navigate(path)}>
//             <CardIcon>{icon}</CardIcon>
//             <CardTitle>{title}</CardTitle>
//             <CardDesc>{desc}</CardDesc>
//             <CardCTA>
//               Go to {title} <span>→</span>
//             </CardCTA>
//           </Card>
//         ))}
//       </Grid>
//     </Wrapper>
//   );
// };

// export default Dashboard;
