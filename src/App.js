import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import Missing from "./Pages/Missing";
import Header from "./Components/Header";
import HomePage from "./Components/HomePage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import About from "./Pages/About";
import RequireAuth from "./Components/RequireAuth";
import PersistLogin from "./Components/PersistLogin";
import Users from "./Components/Users/Users";
import DashBoard from "./Components/DashBoard";
import Overview from "./Components/Overview";
import CssBaseline from "@mui/material/CssBaseline";
import VerifyEmail from "./Pages/VerifyEmail";
import LoadingPage from "./Components/UserFeedback/LoadingPage";
import ForgotPassword from "./Pages/ForgotPassword";
const ManageExercise = lazy(() =>
  import("./Components/Exercise/ManageExercise")
);
const TabView = lazy(() => import("./Components/Profile/TabView"));
const CreateWorkout = lazy(() =>
  import("./Components/Workout/CreateWorkout/CreateWorkout")
);
const StartWorkout = lazy(() =>
  import("./Components/Workout/StartWorkout/StartWorkout")
);
const ManageCustomWorkouts = lazy(() =>
  import("./Components/Trainer/ManageCustomWorkouts")
);
const ManageClient = lazy(() => import("./Components/Trainer/ManageClient"));
const ViewWorkouts = lazy(() =>
  import("./Components/Workout/ViewWorkout/ViewWorkouts")
);
const Measurements = lazy(() =>
  import("./Components/Measurements/Measurements")
);
const ProgressPics = lazy(() =>
  import("./Components/Measurements/ProgressPics")
);
const Messages = lazy(() => import("./Components/Notifications/Messages"));

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
      <Suspense fallback={<LoadingPage />}>
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

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    {/* admin routes */}
                    <Route
                      path="manage-customworkouts"
                      element={<ManageCustomWorkouts />}
                    />

                    <Route
                      path="manage-exercises"
                      element={<ManageExercise />}
                    />
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
      </Suspense>
    </div>
  );
}

export default App;
