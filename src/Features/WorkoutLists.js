
import {Row, Col} from 'reactstrap';
import useFetch from '../utils/useFetch';




// Going to display workouts here


const WorkoutLists = () => {
    const { loading, error, data: workouts } = useFetch('http://localhost:8000/workouts');
    return (
        <Row className='ms-auto'>
            {error && <p>Error loading</p>}
            {loading && <p>Loading...</p>}

            {workouts && workouts.map((workout) => {
                return (
                    <Col md='5' className='m-4' key={workout.id}>
                       <a href={workout.id}> {workout.name} {workout.ClientName}</a>
                    </Col>
                );
            })}
        </Row>
    );
};

export default WorkoutLists;