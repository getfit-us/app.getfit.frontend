import Login from "../Pages/Login";

import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";

test("render login inputs", () => {
  render(
    <Router>
      <Login />{" "}
    </Router>
  );
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const rememberMeSwitch = screen.getByLabelText(/Trust this device/i);
  const loginButton = screen.getByRole("button", { name: /Login/i });
  const forgotPasswordLink = screen.getByRole("link", {
    name: /Forgot Password/i,
  });
  const signUpLink = screen.getByRole("link", {
    name: /Don't have an account?/i,
  });
});

test("login inputs value change", () => {
  render(
    <Router>
      <Login />{" "}
    </Router>
  );
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  fireEvent.change(emailInput, { target: { value: "test@testing.com" } });
  fireEvent.change(passwordInput, { target: { value: "test123" } });
  expect(emailInput.value).toBe("test@testing.com");
  expect(passwordInput.value).toBe("test123");
});

test("form validation", async () => {
  render(
    <Router>
      <Login />{" "}
    </Router>
  );
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole("button", { name: /Login/i });
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();

  fireEvent.change(emailInput, { target: { value: "test@testing.com" } });
  fireEvent.change(passwordInput, { target: { value: "test123" } });
  await  fireEvent.click(loginButton);

  const emailError =  screen.getByText(/Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values/i);
    const passwordError = screen.getByText(/Password is required/i);
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();


  expect(emailInput.value).toBe("test@testing.com");
  expect(passwordInput.value).toBe("test123");
});

