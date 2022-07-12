import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarText, NavbarToggler, Button } from "reactstrap";
import {useState} from 'react';
import {NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cookie, setCookie] = useState(false);

  

    return (
           
            <Navbar
                color="dark"
                expand="lg"
                dark
            >
                <NavbarBrand href="/">
                    Get Fitness App
                </NavbarBrand>
                <NavbarToggler onClick={() => setMenuOpen(!menuOpen)}/>
                <Collapse isOpen={menuOpen}navbar>
                    <Nav
                        className="me-auto"
                        navbar
                    >
                        <NavItem>
                            <NavLink to="/login" className='nav-link'>
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
                            <NavLink to="/clients" className='nav-link'>
                            Clients
                                    </NavLink>
                        </NavItem>
                        
                        {cookie && 
                        <NavItem>
                       <Button type="button" onClick={() =>{
                        Cookies.remove('session_token');
                        setCookie(true);
                        
                        }} >
                        Log Out
                                </Button>
                    </NavItem>}

                    </Nav>
                    <NavbarText>
                        
                    </NavbarText>
                </Collapse>
            </Navbar>
        
            
    )
}

export default Header;