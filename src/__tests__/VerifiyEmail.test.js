import VerifyEmail from '../Pages/VerifyEmail';

import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";

test("renders learn react link", () => {
  render(
    <Router>
      <VerifyEmail />
    </Router>
  );

  // const linkElement = screen.getByText(/Verify Email/i);

  // expect(linkElement).toBeInTheDocument();
});
