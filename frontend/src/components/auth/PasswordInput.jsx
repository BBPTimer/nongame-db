import { useState } from "react";

const PasswordInput = ({ id, label }) => {
  const [showInput, setShowInput] = useState(false);

  const toggleShowPassword = () => {
    setShowInput(!showInput);
  };

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={showInput ? "text" : "password"} minLength={8} required />
      {showInput ? (
        <span
          className="material-symbols-outlined"
          title="Click to hide password"
          onClick={toggleShowPassword}
        >
          visibility_off
        </span>
      ) : (
        <span
          className="material-symbols-outlined"
          title="Click to show password"
          onClick={toggleShowPassword}
        >
          visibility
        </span>
      )}
    </>
  );
};

export default PasswordInput;
