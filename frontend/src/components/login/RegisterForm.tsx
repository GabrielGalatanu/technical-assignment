import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import Textfield from "../common/Textfield";
import BasicButton from "../common/BasicButton";
import { register } from "../../services/api/user";

import "../../styles/login/RegisterForm.scss";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegisterButton = async () => {
    //TO DO: add email validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setErrorMessage("");

    let response = await register(firstName, lastName, email, password);

    if (!response.success) setErrorMessage(response.message);

    if (response.success) navigate("/login");
  };

  const handleBackToLoginButton = () => navigate("/login");

  return (
    <div className="register-form__container">
      <p className="register-text-title">Register</p>
      <div className="email-and-password-container">
        <Textfield
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Textfield
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Textfield
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <Textfield
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Textfield
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="register-button-container">
        <BasicButton label="Register" onPress={handleRegisterButton} />
      </div>

      <p className="register-text" onClick={handleBackToLoginButton}>
        Back to Login
      </p>
    </div>
  );
};

export default RegisterForm;
