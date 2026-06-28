import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useGetUsers, useDeleteUser } from "../hooks/useUsers";

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const filtered = data?.users ?? [];

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete ${name}?`)) {
      deleteUser(id);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Left>
          <Back onClick={() => navigate("/dashboard")}>← Back</Back>
          <Title>Users</Title>
        </Left>
        <SearchInput
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Header>

      <Card>
        {isLoading ? (
          <Loading>Loading users...</Loading>
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH>Action</TH>
              </tr>
            </THead>
            <TBody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <Empty>No users found.</Empty>
                  </td>
                </tr>
              ) : (
                filtered.map((user: User) => (
                  <TR key={user.id}>
                    <TD>{user.name}</TD>
                    <TD>{user.email}</TD>
                    {user.role && (
                      <TD>
                        <Badge role={user.role} />
                      </TD>
                    )}
                    <TD>
                      <DeleteBtn
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        Delete
                      </DeleteBtn>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        )}
      </Card>
    </Wrapper>
  );
};

export default Users;

// Layout
const Wrapper = styled.div.attrs({
  className: "min-h-screen bg-gray-50 p-8",
})``;
const Header = styled.div.attrs({
  className: "flex items-center justify-between mb-6",
})``;
const Left = styled.div.attrs({ className: "flex items-center gap-3" })``;
const Back = styled.button.attrs({
  className: "text-sm text-gray-400 hover:text-gray-600 transition-colors",
})``;
const Title = styled.h1.attrs({
  className: "text-3xl font-bold text-gray-800",
})``;
const Card = styled.div.attrs({
  className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6",
})``;

// Search
const SearchInput = styled.input.attrs({
  className:
    "border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-72",
})``;

// Table
const Table = styled.table.attrs({ className: "w-full text-sm" })``;
const THead = styled.thead.attrs({
  className: "bg-gray-50 text-gray-500 uppercase text-xs",
})``;
const TBody = styled.tbody.attrs({ className: "divide-y divide-gray-100" })``;
const TR = styled.tr.attrs({
  className: "hover:bg-gray-50 transition-colors",
})``;
const TH = styled.th.attrs({ className: "text-left px-4 py-3 font-medium" })``;
const TD = styled.td.attrs({ className: "px-4 py-3 text-gray-700" })``;

// Badge
const roleBadgeClass: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-600",
  TEACHER: "bg-blue-100 text-blue-600",
  STUDENT: "bg-green-100 text-green-600",
  USER: "bg-gray-100 text-gray-600",
};

const Badge = ({ role }: { role: string }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${roleBadgeClass[role] || "bg-gray-100 text-gray-600"}`}
  >
    {role}
  </span>
);

// Delete Button
const DeleteBtn = styled.button.attrs({
  className:
    "text-red-400 hover:text-red-600 text-sm font-medium transition-colors",
})``;

const Empty = styled.p.attrs({
  className: "text-center text-gray-400 text-sm py-8",
})``;
const Loading = styled.p.attrs({
  className: "text-center text-gray-400 text-sm py-8",
})``;
