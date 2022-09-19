import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Missing from "./Pages/Missing";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Components/HomePage";
import SignUp from "./Pages/SignUp";
import SignUpClient from "./Pages/SignUpClient";
import Login from "./Pages/Login";
import About from "./Pages/About";
import RequireAuth from "./Components/RequireAuth";

import Users from "./Components/Users/Users";
import DashBoard from "./Components/DashBoard";
import ManageExercise from "./Components/Exercise/ManageExercise";
import Overview from "./Components/Overview";
import CssBaseline from "@mui/material/CssBaseline";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
 
  const [loadingApi, setLoadingApi] = useState(false);
  const [err, setError] = useState();
  const [page, setPage] = useState(<Overview loadingApi={loadingApi} />);
  return (
    <div className="App" style={{backgroundColor: "#f2f4f7"}}>
      <CssBaseline />

      <Router>
        <Header
          setPage={setPage}
          page={page}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          loadingApi={loadingApi}
          setLoadingApi={setLoadingApi}
          err={err}
          setError={setError}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/:trainerId" element={<SignUpClient />} />

          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify/:id/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password/:id/:token" element={<ForgotPassword />} />


          <Route element={<RequireAuth />}>
            {/* everything inside of this route is auth required*/}
            {/* <Route path='/password' element={<Password />} /> */}
            {/* admin routes */}
            {/* <Route path="/userlist" element={<Users />} />
            <Route path="/manageexercises" element={<ManageExercise />} />

            <Route path="/addworkout" element={<AddWorkoutForm />} />
            <Route path="/workoutlists" element={<WorkoutLists />} /> */}

            <Route
              path="/dashboard"
              element={
                <DashBoard
                  setPage={setPage}
                  page={page}
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                  loadingApi={loadingApi}
                  setLoadingApi={setLoadingApi}
                  err={err}
                  setError={setError}
                />
              }
            />
            {/* <Route path='/profile' element={<Profile />} /> */}
          </Route>

          <Route path="*" element={<Missing />} />
        </Routes>

        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
