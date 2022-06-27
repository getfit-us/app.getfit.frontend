import {selectAllWorkouts} from './workOutSlice';
import {Row, Col} from 'reactstrap';


// Going to display workouts here


const WorkoutLists = () => {
    const workouts = selectAllWorkouts();
    return (
        <Row className='ms-auto'>
            {workouts.map((workout) => {
                return (
                    <Col md='5' className='m-4' key={workout.id}>
                        {workout.name} {workout.ClientName}
                    </Col>
                );
            })}
        </Row>
    );
};

export default WorkoutLists;