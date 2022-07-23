import {Container} from '@mui/material'
import {Link} from 'react-router-dom';



const DashBoard = () => {
  return (
    <Container>
    
          <h1>Dashboard</h1>
     

    
          <ul>
            <li><Link to="/clientlist">Client List</Link></li>
            <li><Link to="/userlist">Users List</Link></li>
            <li><Link to="/addworkout">Add Workouts </Link></li>
            <li><Link to="/manageexercises">Manage Exercises </Link></li>


          </ul>
     



    </Container>

  )
}

export default DashBoard;