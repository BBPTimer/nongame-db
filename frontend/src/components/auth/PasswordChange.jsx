import { use, useState } from "react";
import { useNavigate } from "react-router";
import PasswordInput from "./PasswordInput.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { readFormData } from "../../common/utils.js";

const PasswordChange = () => {
  const { auth } = use(AuthContext);

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async (event) => {
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
    // PUT request
    let response = await fetch("http://localhost:8080/api/users/pwChange", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify({
        newPassword: formJson.password,
      }),
    });
    if (response?.status === 200) {
      alert("Password changed");
      navigate("/custom");
    } else {
      console.error(response);
      setSubmitting(false);
      alert("Error changing password");
    }
  };

  return (
    <main>
      <h1>Change Password</h1>{" "}
      <form onSubmit={handleChangePassword} className="white-bg">
        <PasswordInput id="password" label="Password" />
        <br />

        <PasswordInput id="verifyPassword" label="Verify Password" />
        <br />

        <button type="submit" className="pulsate" disabled={submitting}>
          Save
        </button>
        <button type="button" onClick={() => navigate("/custom")}>
          Cancel
        </button>
      </form>
    </main>
  );
};

export default PasswordChange;
