import styled from "styled-components";
import { useAuthStore } from "../store/authStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  ShieldCheck,
  Clock,
  CalendarDays,
  RefreshCw,
  CircleDot,
} from "lucide-react";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import { useProfile } from "@/hooks/useAuth";

const formatDate = (iso?: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "bg-violet-100 text-violet-700 border-violet-200",
  TEACHER: "bg-sky-100 text-sky-700 border-sky-200",
  STUDENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
  USER: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const STATUS_STYLE: Record<Status, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-gray-100 text-gray-500 border-gray-200",
  BLOCKED: "bg-red-100 text-red-600 border-red-200",
  DELETED: "bg-zinc-100 text-zinc-400 border-zinc-200",
};

const STATUS_DOT: Record<Status, string> = {
  ACTIVE: "bg-emerald-500",
  INACTIVE: "bg-gray-400",
  BLOCKED: "bg-red-500",
  DELETED: "bg-zinc-400",
};

const ProfilePage: React.FC = () => {
  const { isHydrated } = useAuthStore();
  const { data: user, isLoading } = useProfile();

  if (!isHydrated || isLoading) return <Loader />;

  if (!user) {
    return (
      <Wrapper>
        <p className="text-gray-400 text-sm">No user data available.</p>
      </Wrapper>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Wrapper>
      {/* ── Back + Heading ── */}
      <BackRow>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-4 -ml-2"
        >
          <ArrowLeft size={15} />
          Back
        </Button> */}
        <PageTitle>My Profile</PageTitle>
        <PageSub>View your account details and activity</PageSub>
      </BackRow>

      {/* ── Profile Card ── */}
      <ProfileCard>
        {/* Banner */}
        <CardBanner />

        <CardBody>
          {/* Avatar + Status */}
          <AvatarRow>
            <Avatar>{initials}</Avatar>
            <StatusPill>
              <Badge
                variant="outline"
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 ${STATUS_STYLE[user.status]}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`}
                />
                {user.status}
              </Badge>
            </StatusPill>
          </AvatarRow>

          {/* Name + Email */}
          <Name>{user.name}</Name>
          <EmailText>{user.email}</EmailText>

          {/* Role + ID */}
          <RoleRow>
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 ${ROLE_STYLE[user.role]}`}
            >
              <ShieldCheck size={11} className="mr-1 inline-block" />
              {user.role}
            </Badge>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-mono">
              ID #{user.id}
            </span>
          </RoleRow>

          <Separator className="my-6 bg-gray-100" />

          {/* Meta Grid */}
          <MetaGrid>
            <MetaItem>
              <MetaIcon>
                <Mail size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Email Address</MetaLabel>
                <MetaValue>{user.email}</MetaValue>
              </div>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <User size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Full Name</MetaLabel>
                <MetaValue>{user.name}</MetaValue>
              </div>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <Clock size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Last Login</MetaLabel>
                <MetaValue>{formatDate(user.lastLogin)}</MetaValue>
              </div>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <CircleDot size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Account Status</MetaLabel>
                <MetaValue>{user.status}</MetaValue>
              </div>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <CalendarDays size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Joined On</MetaLabel>
                <MetaValue>{formatDate(user.createdAt)}</MetaValue>
              </div>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <RefreshCw size={15} />
              </MetaIcon>
              <div>
                <MetaLabel>Last Updated</MetaLabel>
                <MetaValue>{formatDate(user.updatedAt)}</MetaValue>
              </div>
            </MetaItem>
          </MetaGrid>
        </CardBody>
      </ProfileCard>
      <BackButton />
    </Wrapper>
  );
};

export default ProfilePage;

const Wrapper = styled.div.attrs({
  className: "w-full min-h-screen bg-[#F7F8FC]",
})``;

const BackRow = styled.div.attrs({
  className: "mb-8",
})``;

const PageTitle = styled.h1.attrs({
  className: "text-2xl font-bold text-gray-900 tracking-tight",
})``;

const PageSub = styled.p.attrs({
  className: "text-sm text-gray-400 mt-0.5",
})``;

const ProfileCard = styled.div.attrs({
  className:
    "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
})``;

const CardBanner = styled.div.attrs({
  className:
    "h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500",
})``;

const CardBody = styled.div.attrs({
  className: "px-6 pb-6",
})``;

const AvatarRow = styled.div.attrs({
  className: "flex items-end justify-between -mt-10 mb-4",
})``;

const Avatar = styled.div.attrs({
  className:
    "w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md " +
    "flex items-center justify-center text-2xl font-bold text-indigo-600",
})``;

const StatusPill = styled.div.attrs({
  className: "mb-1",
})``;

const Name = styled.h2.attrs({
  className: "text-xl font-bold text-gray-900",
})``;

const EmailText = styled.p.attrs({
  className: "text-sm text-gray-400 mt-0.5",
})``;

const RoleRow = styled.div.attrs({
  className: "flex items-center gap-2 mt-3",
})``;

const MetaGrid = styled.div.attrs({
  className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6",
})``;

const MetaItem = styled.div.attrs({
  className:
    "flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100",
})``;

const MetaIcon = styled.div.attrs({
  className:
    "w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0 shadow-sm",
})``;

const MetaLabel = styled.p.attrs({
  className: "text-xs text-gray-400 font-medium mb-0.5",
})``;

const MetaValue = styled.p.attrs({
  className: "text-sm font-semibold text-gray-800",
})``;
