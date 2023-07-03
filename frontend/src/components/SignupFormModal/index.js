import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!firstName.length) {
      validationErrors.firstName = "First name field cannot be empty";
    }

    if (!lastName.length) {
      validationErrors.lastName = "Last name field cannot be empty";
    }

    if (username.length < 4) {
      validationErrors.username = "Username must be four characters or longer";
    }

    if (password.length < 6) {
      validationErrors.password = "Password must be six characters or longer";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords don't match";
    }

    if (!email.length) {
      validationErrors.email = "Email can't be empty";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
  };

  const isDisabled =
    !firstName ||
    !lastName ||
    username.length < 4 ||
    password.length < 6 ||
    password !== confirmPassword;

  return (
    <>
      <h1 className="signup-title">Sign Up</h1>
      {Object.keys(errors).length > 0 && (
        <div className="error-container">
          {Object.values(errors).map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signup-input"
          />
        </label>
        <button
          type="submit"
          className="signup-button"
          disabled={isDisabled}
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
