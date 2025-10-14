import { use } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { removeTokenFromStorage } from "../../services/storageService";

const LogoutButton = () => {
  const { setAuth } = use(AuthContext);

  // Logout
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuth({
      token: null,
      email: null,
      isAuthenticated: false,
    });
    removeTokenFromStorage();
    navigate("/");
  };

  return <button onClick={handleLogOut}>Logout</button>;
};

export default LogoutButton;
