import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';


import Missing from './Pages/Missing';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import SignUp from './Pages/SignUp';
import SignUpClient from './Pages/SignUpClient';
import Login from './Pages/Login';
import About from './Pages/About';
import Clients from './Components/Clients';
import RequireAuth from './Components/RequireAuth';
import WorkoutLists from './Features/WorkoutLists';
import AddWorkoutForm from './Features/AddWorkouts';
import Users from './Components/Users';
import DashBoard from './Components/DashBoard';
import ManageExercise from './Features/ManageExercise'
import Profile from './Pages/Profile';
import Password from './Pages/Password';
import useAuth from './utils/useAuth';



function App() {

  const { auth } = useAuth();
  const [user, setUser] = useState(auth);
  return (
    <div className="App">

      <Router>



        <Header user={user} setUser={setUser} />
        <Routes>




          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/:trainerId" element={<SignUpClient />} />

          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/about' element={<About />} />

          <Route element={<RequireAuth />}>
            {/* everything inside of this route is auth required*/}
            <Route path='/password' element={<Password />} />
            {/* admin routes */}
            <Route path='/userlist' element={<Users />} />
            <Route path='/manageexercises' element={<ManageExercise />} />

              <Route path='/addworkout' element={<AddWorkoutForm />} />
              <Route path='/workoutlists' element={<WorkoutLists />} />

              <Route path='/dashboard' element={<DashBoard />} />
              <Route path='/profile' element={<Profile setUser={setUser} />} />








          </Route>

          <Route path='*' element={<Missing />} />



        </Routes>



        <Footer />
      </Router>

    </div>

  );
}

export default App;
