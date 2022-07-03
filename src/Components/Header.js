import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarText, NavbarToggler } from "reactstrap";
import {useState} from 'react';
import {NavLink } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
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
                        
                    </Nav>
                    <NavbarText>
                        
                    </NavbarText>
                </Collapse>
            </Navbar>
        
            
    )
}

export default Header;