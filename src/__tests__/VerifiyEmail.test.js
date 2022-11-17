import VerifyEmail from '../Pages/VerifyEmail';

import { test , screen} from '@jest/globals';
import {render} from '@testing-library/react'


import { BrowserRouter as Router } from "react-router-dom";

import React from "react";

test("renders learn react link", () => {
  render(
    <Router>
      <VerifyEmail />
    </Router>
  );

  // const linkElement = screen.getByText(/Verify Email/i);

  // expect(linkElement).toBeInTheDocument();
});
