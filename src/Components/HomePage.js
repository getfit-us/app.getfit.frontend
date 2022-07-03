import { Container, Row, Col } from 'reactstrap';
import AddWorkoutForm from '../Features/AddWorkouts';
import WorkoutLists from '../Features/WorkoutLists';


const HomePage = () => {

    return (

        

        
        <Container className="mt-5">
            <Row className="text-center">
                <Col>
                    <h1> Get Fitness App</h1>

                </Col>




            </Row>


            <Row>

                <Col>
                <WorkoutLists/>
                    
                </Col>
            </Row>

            <Row>
                <Col >
                <AddWorkoutForm/>
                </Col>
            </Row>

        </Container>
        
    );
}

export default HomePage;
