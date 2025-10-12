import { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import PasswordInput from "./PasswordInput.jsx";
import {
  setEmailInStorage,
  setTokenInStorage,
} from "../../services/storageService.js";
import {
  requestLogin,
  requestRegistration,
} from "../../services/authService.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { readFormData } from "../../common/utils.js";

const RegisterPage = () => {
  const { setAuth } = use(AuthContext);

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const logInUser = async (email, password) => {
    try {
      let body = { email, password };
      let response = await requestLogin(body);
      if (response?.status === 200) {
        let token = response.data.token;
        setEmailInStorage(email);
        setTokenInStorage(token);
        setAuth({ token, email, isAuthenticated: true });
        navigate("/custom");
      }
    } catch (error) {
      console.error(error.message);
      // Would be better to give user feedback on page here
    }
  };

  const createNewUser = async (email, password) => {
    try {
      let body = {
        email,
        password,
      };
      let response = await requestRegistration(body);
      if (response?.status === 201) {
        logInUser(email, password);
      }
    } catch (error) {
      console.error(error);
      // Would be better to give user feedback on page here
    }
  };

  const handleRegister = (event) => {
    // Prevent form submission
    event.preventDefault();
    // Prevent multiple submissions
    setSubmitting(true);
    // Read form data
    const formJson = readFormData(event);
    // Confirm passwords match
    if (formJson.password !== formJson.verifyPassword) {
      alert("Passwords do not match");
      // Allow user to re-submit
      setSubmitting(false);
      return;
    }
    createNewUser(formJson.email, formJson.password);
  };

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="white-bg">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <br />

        <PasswordInput id="password" label="Password" />
        <br />

        <PasswordInput id="verifyPassword" label="Verify Password" />
        <br />

        <button type="submit" disabled={submitting}>
          Register
        </button>
      </form>
      <br />

      <span>
        Already have an account? <Link to="/login">Log in here.</Link>
      </span>
    </main>
  );
};

export default RegisterPage;
