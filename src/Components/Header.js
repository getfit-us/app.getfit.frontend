
import { AppBar, Typography, Toolbar, Box, IconButton, Menu, Container, MenuItem, Button, Avatar, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import MenuIcon from '@mui/icons-material/Menu';
import useAxiosPrivate from '../utils/useAxiosPrivate';



const Header = () => {

    const axiosPrivate = useAxiosPrivate();
    const { setAuth, auth } = useAuth();
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [dashboard, setDashboard] = useState({});
    const navigate = useNavigate();
    const drawerWidth = 200;
    const location = useLocation();



    // create use effect to check if location is dashboard to adjust navbar

    useEffect(() => {

        if (location.pathname === '/dashboard') {
            setDashboard({

                width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,


            })
        } else if (location.pathname !== '/dashboard') {
            setDashboard({});
        }

    }, [location.pathname])


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onLogout = async () => {
        let isMounted = true;

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get('/logout', { signal: controller.signal });
            // console.log(response.data);
            setAuth({});
            navigate('/');



        }
        catch (err) {
            console.log(err);

        }
        return () => {
            isMounted = false;


            controller.abort();
        }

    }






    return (


        <AppBar position='static' classes={dashboard} sx={dashboard}
        >

            <Container maxWidth="xl">
                <Toolbar disableGutters>


                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            mt: 1, mb: 1
                        }}
                    >
                        <img src={require("../assets/img/GF-logo-sm.png")} alt='getfit Logo' width="50%" height="50%" />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem >
                                <Button component={Link} to="/sign-up" label="Home" >Sign Up</Button>
                            </MenuItem>
                            <MenuItem>
                                <Button component={Link} to="/Login" label="Home">Login</Button>
                            </MenuItem>
                            <MenuItem>
                                <Button component={Link} to="/about" label="Home">About</Button>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2, mt: 1, mb: 1,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={require("../assets/img/GF-logo-sm.png")} alt='getfit Logo' width="30%" height="30%" />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className="">

                        <MenuItem component={Link} to="/sign-up" label="Home" >Sign Up</MenuItem>
                        <MenuItem component={Link} to="/login" label="Home">Login</MenuItem>
                        <MenuItem component={Link} to="/about" label="Home">About</MenuItem>

                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: 'red' }}>{auth.email && auth.firstName[0].toUpperCase()}</Avatar>


                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem component={Link} to="/dashboard">DashBoard


                            </MenuItem>
                            
                            <MenuItem component={Link} to="/profile">Profile


                            </MenuItem>


                            <MenuItem> {auth.email &&
                                <Typography onClick={onLogout}>Logout</Typography>}

                            </MenuItem>







                        </Menu>
                    </Box>
                </Toolbar>


            </Container>

        </AppBar>

    )
}

export default Header;