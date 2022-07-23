import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { styled} from '@mui/material/styles';

import {useState} from 'react';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import SubscriptionsSharpIcon from '@mui/icons-material/SubscriptionsSharp';



function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
          
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}



const Footer = () => {


    const [value, setValue] = useState(0);




    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
        
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'rgb(7, 47, 107)'
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body1">

                    <BottomNavigation elevation={2}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
       sx={{"& .MuiBottomNavigationAction-root, .Mui-selected, svg": {
        color: "red"
      }, backgroundColor: "rgb(7, 47, 107)"}}
       
      >
        <BottomNavigationAction component={Link}  to="/" label="Home" icon={<HomeSharpIcon />}    sx={{  ".MuiBottomNavigationAction-root, .Mui-selected, svg": {
     color: 'red'
   }}}/>
        
        <BottomNavigationAction  component={Link}  to="/login" label="Login" icon={<LoginSharpIcon />} />
        <BottomNavigationAction  component={Link}  to="/about" label="About" icon={<InfoSharpIcon />} />
        <BottomNavigationAction  component={Link}  to="/sign-up" label="Sign Up" icon={<SubscriptionsSharpIcon />} />
        
       
      </BottomNavigation>
            
              
              
              
             
            
        
       
                     
                    </Typography>
                    <Copyright />
                </Container>
            </Box>
        </Box>

    );
};

export default Footer;


