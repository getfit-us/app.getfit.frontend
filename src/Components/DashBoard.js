import {Container, Drawer, Typography, MenuItem, Button} from '@mui/material'
import {Link} from 'react-router-dom';

const drawerWidth = 200;

const DashBoard = () => {
  return (
    <Container mt={3} >
        <Drawer 
        sx={{
          width: drawerWidth,
          paper: {
            width: drawerWidth,
          }
        }}
        variant="permanent"
        anchor="left"
      >
      
      <Typography variant='h3'>Dashboard</Typography>

      <MenuItem >                          
                            <Button component={Link} to="/manageexercises"  >Manage Exercises</Button>
                            </MenuItem>
                            <MenuItem>
                                <Button component={Link} to="/addworkout" >Add Workout</Button>
                            </MenuItem>
                            <MenuItem>
                                <Button component={Link} to="/userlist">User List</Button>
                            </MenuItem>
                            <MenuItem>
                                <Button component={Link} to="/clientlist">Client List</Button>
                            </MenuItem>

      </Drawer>
         
        

    
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