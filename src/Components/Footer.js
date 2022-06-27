import { Col, Row, Container } from 'reactstrap';


const Footer = () => {
    return (
        <footer className="mt-5 "style={{backgroundColor: 'rgb(101, 105, 102)'}}>

        
      
            <Row className="p-4" >

                <Col lg='6' className="">
                    <h4>About Us</h4>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi nesciunt repellendus libero cumque quod architecto, ea, iste vel voluptatum possimus veritatis modi laboriosam fugiat officiis ducimus accusamus sit at labore!</p>


                </Col>

                <Col lg='6' sm ='4' className="">
                    <h4 className="links">Links</h4>

                <ul className="links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/login">Sign up</a></li>
                </ul>



                </Col>

                <Col>



                </Col>

                <Col>



                </Col>
            </Row>


            </footer>


    );
}

export default Footer;