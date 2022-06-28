import { Link } from 'react-router-dom';
import { Col, Row, Container } from 'reactstrap';


const Footer = () => {
    return (
        
        <footer className="" style={{backgroundColor: 'rgb(101, 105, 102)', position: 'absolute',
        bottom: 0, left: 0,
        right: 0}}>

<Container>
      
            <Row className="mt-3" >

                <Col lg='' className="">
                    <h4>About Us</h4>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi nesciunt repellendus libero cumque quod architecto, ea, iste vel voluptatum possimus veritatis modi laboriosam fugiat officiis ducimus accusamus sit at labore!</p>


                </Col>

                <Col lg='' sm ='4' className="">
                    <h4 className="links">Links</h4>

                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/sign-up">Sign up</Link></li>
                </ul>



                </Col>

                <Col>



                </Col>

                <Col>



                </Col>
            </Row>

            </Container>
            </footer>

            
    );
}

export default Footer;