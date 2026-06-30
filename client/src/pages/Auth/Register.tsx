import { useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";
import toast from "react-hot-toast";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (): void => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password?.trim()) {
      toast.error("Please fill name, email, password");
      return;
    }
    mutate(form);
  };

  return (
    <Page>
      <Box>
        <Title>Create account</Title>
        <Sub>Sign up to get started</Sub>

        <Label>Name</Label>
        <Input
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />

        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
        />

        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        {/* {isError && <Error>Registration failed. Please try again.</Error>} */}

        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </Button>

        <Footer>
          Already have an account?{" "}
          <Link onClick={() => navigate("/login")}>Login</Link>
        </Footer>
      </Box>
    </Page>
  );
};

export default Register;

const Page = styled.div.attrs({
  className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
})``;
const Box = styled.div.attrs({
  className:
    "bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md",
})``;
const Title = styled.h1.attrs({
  className: "text-2xl font-bold text-gray-800 mb-1",
})``;
const Sub = styled.p.attrs({ className: "text-sm text-gray-400 mb-6" })``;
const Label = styled.label.attrs({
  className: "block text-sm font-medium text-gray-600 mb-1",
})``;
const Input = styled.input.attrs({
  className:
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4",
})``;
const Button = styled.button.attrs({
  className:
    "w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2 disabled:opacity-50",
})``;
const Footer = styled.p.attrs({
  className: "text-center text-sm text-gray-400 mt-4",
})``;
const Link = styled.span.attrs({
  className: "text-indigo-500 cursor-pointer hover:underline",
})``;
// const Error = styled.p.attrs({
//   className: "text-red-400 text-sm mt-2 text-center",
// })``;
