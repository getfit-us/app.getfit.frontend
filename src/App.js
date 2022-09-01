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
import WorkoutLists from "./Features/WorkoutLists";
import AddWorkoutForm from "./Features/AddWorkouts";
import Users from "./Components/Users";
import DashBoard from "./Components/DashBoard";
import ManageExercise from "./Features/ManageExercise";
import Overview from "./Components/Overview";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(<Overview />);
  const [loadingApi, setLoadingApi] = useState(false);
  const [err, setError] = useState();
  return (
    <div className="App">
      <CssBaseline />

      <Router>
        <Header
          setPage={setPage}
          page={page}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          loadingAp={loadingApi}
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

          <Route element={<RequireAuth />}>
            {/* everything inside of this route is auth required*/}
            {/* <Route path='/password' element={<Password />} /> */}
            {/* admin routes */}
            <Route path="/userlist" element={<Users />} />
            <Route path="/manageexercises" element={<ManageExercise />} />

            <Route path="/addworkout" element={<AddWorkoutForm />} />
            <Route path="/workoutlists" element={<WorkoutLists />} />

            <Route
              path="/dashboard"
              element={
                <DashBoard
                  setPage={setPage}
                  page={page}
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                  loadingAp={loadingApi}
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
