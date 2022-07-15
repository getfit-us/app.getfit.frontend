import { Nav, Navbar, NavItem, NavbarBrand, Collapse, NavbarText, NavbarToggler, Button } from "reactstrap";
import {useState, useEffect} from 'react';
import {NavLink, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    // const [cookie, setCookie] = useState(false);
    // const [logout, setLogout] = useState(false);
    // const navigate = useNavigate();
    // useEffect(()=> {

        
    // if (Cookies.get('session_token') !== undefined) {
    //     setCookie(true);
    //     const token = cookies.get('session_token')
    //     return token 
        
    // } else  if (Cookies.get('session_token') === undefined) {
    //     navigate('/login');

    // }

    // },[cookie,logout]);



   
   
   


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
                            <NavLink to="/clients" className='nav-link' >
                            Clients
                                    </NavLink>
                        </NavItem>
                        
                        {false && 
                        <NavItem>
                       <Button type="button" onClick={() =>{
                        // Cookies.remove('session_token');
                        // setCookie(false);
                        // setLogout(true);
                        
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