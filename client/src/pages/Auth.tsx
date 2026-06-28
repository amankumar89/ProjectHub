import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    const fakeUser = {
      id: "1",
      name: "John Doe",
      role: "admin" as const,
    };

    login(fakeUser, "fake-jwt-token");

    navigate("/users");
  };

  return (
    <div className="card">
      <h1>Login</h1>
      <button onClick={handleLogin}>Login as Admin</button>
    </div>
  );
}
