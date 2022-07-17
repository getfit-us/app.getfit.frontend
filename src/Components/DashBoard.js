import { Container, Col, Row } from 'reactstrap';
import {Link} from 'react-router-dom';



const DashBoard = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <ul>
            <li><Link to="/clientlist">Client List</Link></li>
            <li><Link to="/userlist">Users List</Link></li>
            <li><Link to="/addworkout">Add Workouts </Link></li>
            


          </ul>
        </Col>
      </Row>



    </Container>

  )
}

export default DashBoard;