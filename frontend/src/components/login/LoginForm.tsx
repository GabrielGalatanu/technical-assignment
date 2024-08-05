import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Textfield from "../common/Textfield";
import BasicButton from "../common/BasicButton";
import { login } from "../../services/api/user";

import "../../styles/login/LoginForm.scss";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLoginButton = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }
    
    setErrorMessage("");

    let response = await login(email, password);

    if (!response.success) setErrorMessage(response.message);

    if (response.success) navigate("/");
  };

  const handleRegisterButton = () => navigate("/register");

  return (
    <div className="login-form__container">
      <p className="login-text">Login</p>
      <div className="email-and-password-container">
        <Textfield
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Textfield
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="login-button-container">
        <BasicButton label="Login" onPress={handleLoginButton} />
      </div>

      <p className="register-text" onClick={handleRegisterButton}>
        Don't have an account?
      </p>
    </div>
  );
};

export default LoginForm;
