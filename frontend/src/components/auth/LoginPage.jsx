import { Link, useNavigate } from "react-router";
import { use, useState } from "react";
import PasswordInput from "./PasswordInput";
import { requestLogin } from "../../services/authService";
import {
  getEmailFromStorage,
  setEmailInStorage,
  setTokenInStorage,
} from "../../services/storageService";
import { AuthContext } from "../../contexts/AuthContext";
import { readFormData } from "../../common/utils";

const LoginPage = () => {
  const { setAuth } = use(AuthContext);

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const logInUser = async (email, password) => {
    try {
      let response = await requestLogin({ email, password });
      if (response?.status === 200) {
        let token = response.data.token;
        setEmailInStorage(email);
        setTokenInStorage(token);
        setAuth({ token, email, isAuthenticated: true });
        navigate("/custom");
      }
    } catch (error) {
      console.error(error.message);
      alert("Invalid credentials");
      setSubmitting(false);
    }
  };

  const handleLogin = (event) => {
    // Prevent form submission
    event.preventDefault();
    // Prevent multiple submissions
    setSubmitting(true);
    // Read form data
    const formJson = readFormData(event);
    logInUser(formJson.email, formJson.password);
  };

  return (
    <main>
      <h1>Log In</h1>
      <form onSubmit={handleLogin} className="white-bg">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={getEmailFromStorage()}
          required
        />
        <br />

        <PasswordInput id="password" label="Password" />
        <br />

        <button type="submit" disabled={submitting}>
          Log In
        </button>
      </form>
      <br />

      <span>
        Don't have an account? <Link to="/register" className="blue-link">Register here.</Link>
      </span>
      <br />
      <br />

      <a href="mailto:greg@nongame.app?subject=Reset%20password" className="blue-link">
        Forgot password?
      </a>
    </main>
  );
};

export default LoginPage;
