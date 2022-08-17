import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useState } from 'react';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import SubscriptionsSharpIcon from '@mui/icons-material/SubscriptionsSharp';



function Copyright() {
    return (
        <Typography variant="body2" color="white">
            {'Copyright © '}

            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}





const Footer = ({ theme }) => {

    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'), {
        defaultMatches: true,
        noSsr: false
    });
    const [value, setValue] = useState(0);
    const drawerWidth = 200;



    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth + 1}px `,
                ...(!lgUp && {
                    width: `calc(100% - ${50}px)`, ml: `${55}px `,
                })

            }}
        >
            <CssBaseline />

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: '5',
                    backgroundColor: 'rgb(115, 111, 111)'
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
                            sx={{
                                "& .MuiBottomNavigationAction-root": {
                                    color: "rgb(255, 255, 255)"
                                }, ".Mui-selected": "rgb(171, 26, 26)",
                                backgroundColor: "rgb(115, 111, 111)"
                            }}

                        >
                            <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeSharpIcon />} />

                            <BottomNavigationAction component={Link} to="/login" label="Login" icon={<LoginSharpIcon />} />
                            <BottomNavigationAction component={Link} to="/about" label="About" icon={<InfoSharpIcon />} />
                            <BottomNavigationAction component={Link} to="/sign-up" label="Sign Up" icon={<SubscriptionsSharpIcon />} />


                        </BottomNavigation>









                    </Typography>
                    <Copyright />
                </Container>
            </Box>
        </Box>

    );
};

const styles = {


}

export default Footer;


