import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { closeModal } = useModal();

  useEffect(() => {
    const validationErrors = {};
    if (credential.length < 4) {
      validationErrors.credential = "Email must be at least 4 characters";
    }
    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    setValidationErrors(validationErrors);
  }, [credential, password]);

  if (sessionUser) {
    return <Redirect to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrors({});
    setLoginError("");
    if (Object.keys(validationErrors).length === 0) {
      dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
  };

  const isDisabled = credential.length < 4 || password.length < 6;

  return (
    <>
      <h1 className="login-heading">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input id="login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className={isSubmitted && validationErrors.credential ? "input-error" : ""}
          />
        </label>
        {isSubmitted && validationErrors.credential && (
          <p className="error">{validationErrors.credential}</p>
        )}
        <label>
          Password
          <input id="login-input2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={isSubmitted && validationErrors.password ? "input-error" : ""}
          />
        </label>
        {isSubmitted && validationErrors.password && (
          <p className="error">{validationErrors.password}</p>
        )}
        {errors.credential && (
          <p className="error">{errors.credential}</p>
        )}
        <button type="submit" disabled={isDisabled} className="login-button">
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
