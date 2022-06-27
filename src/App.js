import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';


import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';



function App() {
  return (
    <Router>
    <>
   

    
    <Header/>
    <div className="content">
      <Routes>

      
        <Route path="/" element={<HomePage/>}/>
        
        {/* <Route path='/login' element={<ContactPage />} />
        <Route path='/about' element={<ContactPage />} /> */}


        </Routes>

    </div>
    

    <Footer/>
    </>
    </Router>
  );
}

export default App;
