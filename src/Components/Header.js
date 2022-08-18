
import { AppBar, Typography, Toolbar, Box, IconButton, Menu, Container, MenuItem, Button, Avatar, Tooltip, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import useProfile from '../utils/useProfile';
import MenuIcon from '@mui/icons-material/Menu';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { Notifications } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);




const Header = ({ setProfile, profile }) => {

    const axiosPrivate = useAxiosPrivate();
    const { state, dispatch } = useProfile();
    const { setAuth, auth } = useAuth();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotify, setAnchorElNotify] = useState(null);
    const [dashboard, setDashboard] = useState({});
    const navigate = useNavigate();
    const drawerWidth = 200;
    const location = useLocation();
    const [loading, setLoading] = useState(false);
   
    // console.log(state)
    // create use effect to check if location is dashboard to adjust navbar
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'), {
        defaultMatches: true,
        noSsr: false
      });

    useEffect(() => {
            // set width and Margin left based on screensize and page location
        if (location.pathname === '/dashboard') {
            setDashboard({
               
                width: `calc(100% - ${drawerWidth-13}px)`, ml: `${drawerWidth-5}px`,
                ...(!lgUp && {
            width: `calc(100% - ${50}px)`, ml: `${55}px `,
           
          }) 

            })
        } else if (location.pathname !== '/dashboard') {
            setDashboard({});
        }

    }, [location.pathname, lgUp])

   
    


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        if (auth.email) {
            setAnchorElUser(event.currentTarget);
        }
    };

    const handleOpenNotifications = (event) => {
        if (auth.email) {
            setAnchorElNotify(event.currentTarget);
        }
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotify(null);
    };




    const onLogout = async () => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get('/logout', { signal: controller.signal });
            // console.log(response.data);
            setAuth({});
            dispatch({
                type: 'RESET_STATE'
            });


            handleCloseUserMenu();
            navigate('/');



        }
        catch (err) {
            console.log(err);

        }
        return () => {
            isMounted = false;
            setLoading(false);

            controller.abort();
        }

    }

    const styles = (theme) => ({
        toolbar: theme.mixins.toolbar,
      });


    return (

            <>
        <AppBar position='fixed'  sx={dashboard}
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

                    {!state.profile.clientId && <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                    </Box> }

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





                    {!state.profile.clientId && <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className="">

                        <MenuItem component={Link} to="/sign-up" label="Home" >Sign Up</MenuItem>
                        <MenuItem component={Link} to="/login" label="Home">Login</MenuItem>
                        <MenuItem component={Link} to="/about" label="Home">About</MenuItem>

                    </Box>}


                    {/* add notification menu */}
                    {auth.email && <Box sx={{ flexGrow: 1, marginRight: 2, justifyContent: 'right', display: 'flex', alignItems: 'end' }}>
                        <Tooltip title="Notifications">
                            <IconButton onClick={handleOpenNotifications} sx={{ p: 0, }} >

                                <Notifications sx={{ color: 'white' }} />

                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElNotify}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElNotify)}
                            onClose={handleCloseNotificationMenu}
                        >
                            {auth.email && <MenuItem onClick={handleCloseNotificationMenu} component={Link} to="/dashboard">DashBoard
                            </MenuItem>}

                            {auth.email && <MenuItem onClick={() => {
                                setProfile(prev => !prev);
                                handleCloseNotificationMenu();
                            }} >Profile


                            </MenuItem>}














                        </Menu>
                    </Box>}

                    {auth.email && <Box sx={{ alignItems: 'end' }}>
                        <Tooltip title="Manage">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar srcSet={`http://localhost:8000/avatar/${state.profile.avatar}`} sx={{ bgcolor: 'red' }}>{auth.email && auth.firstName[0].toUpperCase()}</Avatar>


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
                            {auth.email && <MenuItem onClick={handleCloseUserMenu} component={Link} to="/dashboard">DashBoard
                            </MenuItem>}

                            {auth.email && <MenuItem onClick={() => {
                                setProfile(prev => !prev);
                                handleCloseUserMenu();
                            }}>Profile


                            </MenuItem>}



                            {auth.email && <MenuItem onClick={onLogout}>Logout</MenuItem>}










                        </Menu>
                    </Box>}


                </Toolbar>

                           
            </Container>

        </AppBar>
        {/* offset adds space under appbar to push content down page */}
        <Offset />
        </>
    )
}

export default Header;