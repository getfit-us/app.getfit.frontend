import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';




import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import About from './Pages/About';
import Clients from './Pages/Clients';
import RequireAuth from './Components/RequireAuth';
import WorkoutLists from './Features/WorkoutLists';
import AddWorkoutForm from './Features/AddWorkouts';


function App() {

  
  return (
    
   
  <Router>
   

    
    <Header/>
    <div className="content">
      <Routes>
    


      
        <Route path="/" element={<HomePage/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
         <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} /> 

        <Route  element={<RequireAuth />}>
        {/* everything inside of this route is auth required*/}
        <Route path='/clients' element={<Clients />} /> 
        <Route path='/AddWorkoutForm' element={<AddWorkoutForm />} /> 
        <Route path='/WorkoutLists' element={<WorkoutLists />} /> 


        </Route>

        {/* <Route path='*' element={<Missing />} />  */}



         </Routes> 

         </div>
            

    <Footer/>
    </Router>
    
    
  );
}

export default App;
