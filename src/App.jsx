import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Missing from "./Pages/Missing";
import Header from "./Components/Header";
import HomePage from "./Components/HomePage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import About from "./Pages/About";
import RequireAuth from "./Components/RequireAuth";
import PersistLogin from "./Components/PersistLogin";
import DashBoard from "./Components/DashBoard";
import Overview from "./Components/Overview";
import CssBaseline from "@mui/material/CssBaseline";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import Help from "./Components/Help/Help";
import Users from "./Components/Users/Users";
import ManageExercise from "./Components/Exercise/ManageExercise";
import TabView from "./Components/Profile/TabView";
import CreateWorkout from "./Components/Workout/CreateWorkout/CreateWorkout";
import StartWorkout from "./Components/Workout/StartWorkout/StartWorkout";
import ManageCustomWorkouts from "./Components/Trainer/ManageCustomWorkouts";
import ManageClient from "./Components/Trainer/ManageClient";
import ViewWorkouts from "./Components/Workout/ViewWorkout/ViewWorkouts";
import Measurements from "./Components/Measurements/Measurements";
import ProgressPics from "./Components/Measurements/ProgressPics";
import Messages from "./Components/Notifications/Messages";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const ROLES = {
    User: 2,
    Trainer: 5,
    Admin: 10,
  };

  return (
    <div className="App" style={{ backgroundColor: "#f2f4f7" }}>
      <CssBaseline />

      <Router>
        <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/:trainerId" element={<SignUp />} />

          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/verify/:id/:token" element={<VerifyEmail />} />

          <Route
            path="/forgot-password/:id/:token"
            element={<ForgotPassword />}
          />

          {/* protected routes */}

          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth
                  allowedRoles={[ROLES.User, ROLES.Admin, ROLES.Trainer]}
                />
              }
            >
              {/* everything inside of this route is auth required*/}

              <Route
                path="/dashboard"
                element={
                  <DashBoard
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                  />
                }
              >
                {/* dashboard routes */}

                <Route path="profile" element={<TabView />} />
                <Route path="overview" element={<Overview />} />
                <Route path="create-workout" element={<CreateWorkout />} />
                <Route path="start-workout" element={<StartWorkout />} />

                <Route path="view-workouts" element={<ViewWorkouts />} />
                <Route path="measurements" element={<Measurements />} />
                <Route path="progress-pictures" element={<ProgressPics />} />
                <Route path="messages" element={<Messages />} />
                <Route path="help" element={<Help />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  {/* admin routes */}
                  <Route
                    path="manage-customworkouts"
                    element={<ManageCustomWorkouts />}
                  />

                  <Route path="manage-exercises" element={<ManageExercise />} />
                  <Route path="manage-users" element={<Users />} />
                  <Route path="manage-clients" element={<ManageClient />} />
                </Route>
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Missing />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
