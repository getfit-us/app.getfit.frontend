import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarText, NavbarToggler, Button } from "reactstrap";
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
// import Cookies from 'js-cookie';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { setAuth, auth } = useAuth();







    return (

        <Navbar
            color="dark"
            expand="lg"
            dark
        >
            <NavbarBrand href="/">
                Get Fitness App
            </NavbarBrand>
            <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
            <Collapse isOpen={menuOpen} navbar>
                <Nav
                    className="me-auto"
                    navbar
                >
                    <NavItem>
                        <NavLink to="/login" className='nav-link' >
                            Login
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/sign-up" className='nav-link'>
                            Sign up
                        </NavLink>
                    </NavItem>


                    <NavItem>
                        <NavLink to="/about" className='nav-link'>
                            About
                        </NavLink>
                    </NavItem>



                   


                    <NavItem>
                        <NavLink to="/dashboard" className='nav-link' >
                            DashBoard
                        </NavLink>
                    </NavItem>


                    {auth.email && 
                        <NavItem>
                       <Button type="button" onClick={() =>{
                        setAuth({});
                        
                        
                        }} >
                        Log Out
                                </Button>
                    </NavItem>
                    



                    }

                </Nav>
                <NavbarText>

                </NavbarText>
            </Collapse>
        </Navbar>


    )
}

export default Header;