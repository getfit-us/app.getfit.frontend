import Login from '../Pages/Login';
import { test , screen} from '@jest/globals';
import {render} from '@testing-library/react'
import { BrowserRouter as Router } from "react-router-dom";

test('render login inputs', () => {
    render(
    <Router>
        <Login />       </Router>);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const rememberMeSwitch = screen.getByLabelText(/Remember Me/i);
    const loginButton = screen.getByRole('button', {name: /Login/i});
    const forgotPasswordLink = screen.getByRole('link', {name: /Forgot Password/i});
    const signUpLink = screen.getByRole('link', {name: /Sign Up/i});
    emailInput.value = 'test@gmail.com';
    passwordInput.value = '123'
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(rememberMeSwitch).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
})