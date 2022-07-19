import { Container, Col, Row, FormGroup, Label, Button, Input, Form } from 'reactstrap';
import { useForm } from 'react-hook-form'
import { validateAddWorkout } from '../utils/validateAddWorkout';
// import useFetch from '../utils/useFetch';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';


const AddWorkoutForm = () => {
    // const { loading, error, data: exercises } = useFetch('http://localhost:8000/exercises');
    const [exercises, setExercises] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const axiosPrivate = useAxiosPrivate();



    let Reps = Array.from(Array(41).keys());
    const [NumberFields, setNumberFields] = useState([1, 2, 3, 4, 5]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const controller = new AbortController();

        const getExercise = async () => {
            try {
                const response = await axiosPrivate.get('/exercises', { signal: controller.signal });
                console.log(response.data);
                isMounted && setExercises(response.data);
                setLoading(false)
            }
            catch (err) {
                console.log(err);
                setError(err);

                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getExercise();
        return () => {
            isMounted = false;
            setLoading(false);

            controller.abort();
        }

    }, [])






    return (
        <Container className="m-5">
            <Row>
                <Col>
                    <h2 className="text-center">Add Workout</h2>
                </Col>

            </Row>

            <Row>
                <Col >

                    {/* Pass the values object to the form so I can access the current values to change the select options of exercises */}
                    {({ values }) => (
                        <Form inline>
                            <FormGroup row inline>
                                <Label htmlFor="WorkoutType" sm='1' lg='2'>
                                    Workout Type:

                                </Label>
                                <Col sm='2' lg='2'>
                                    <Input name="WorkoutType" placeholder='Workout Type' className="form-control" as='select' >
                                        <option >Choose a type</option>
                                        <option value="push">Push</option>
                                        <option value="pull">Pull</option>
                                        <option value="legs">Legs</option>
                                    </Input>

                                </Col>

                                <Label htmlFor="Date" sm='1'>
                                    Date:
                                </Label>
                                <Col sm='2' lg='2'>
                                    <Input type='date' name='Date' placeholder='Date' className="form-control"/>

                                    
                                   
                                </Col>

                            </FormGroup>

                            {/* add map to dynamically add additional Inputs*/}

                            {
                                NumberFields.map((num, index) => {

                                    return (

                                        <FormGroup row floating className="text-center" key={index}>
                                            <Label htmlFor={'Exercise' + num} md='2'  >


                                            </Label>
                                            <Col md='4' >
                                                <Input className="form-control" name={'Exercise' + num} placeholder='' as='select' >
                                                    <option value="null">Choose Exercise.....</option>
                                                    {loading && <option>Loading...</option>}
                                                    {error && <option>Error could not read exercise list</option>}

                                                    {exercises && exercises.filter(exercise => exercise.type === values.WorkoutType).map((exercise) => {





                                                        return (
                                                            <option md='5' className='m-4' key={exercise.id} value={exercise.name}>
                                                                {exercise.name}
                                                            </option>
                                                        )
                                                    })}



                                                </Input>


                                            </Col>

                                            <Label htmlFor={'Weight' + num} md='2' >
                                            </Label>
                                            <Col md='2' lg='2' sm='2'>

                                                <Input className="form-control" name={'Weight' + num} placeholder='Weight' type='text' />




                                            </Col>

                                            <Label htmlFor={'Reps' + num} md='2' >

                                            </Label>
                                            <Col md='3' lg='3' sm='3'>

                                                <Input className="form-control" name={'Reps' + num} placeholder='Reps' as='select' >
                                                    <option value="null">Number of Rep(s)</option>

                                                    {Reps.map((rep) => {
                                                        if (rep !== 0) {


                                                            return (

                                                                <option md='5' className='m-4' key={rep.id} value={rep}>
                                                                    {rep}
                                                                </option>

                                                            )
                                                        }

                                                    })}

                                                </Input>

                                            </Col>

                                            <Col md='2' lg='2' sm='2'>
                                                <Input className="form-control" name={'Sets' + num} placeholder='Sets' as='select' >
                                                    <option value="null">Set Number</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>

                                                </Input>

                                            </Col>
                                        </FormGroup>
                                    )
                                })}








                            <FormGroup row>
                                <Col>
                                    <Button type='button' onClick={() => setNumberFields(
                                        previousNumberFields =>
                                            [...previousNumberFields, previousNumberFields.length + 1]



                                    )} color='primary' >

                                        Add Exercise
                                    </Button></Col>

                            </FormGroup>




                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type='submit' color='primary' >

                                        Log Workout
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    )}




                </Col>
            </Row>
        </Container >

    )

}


export default AddWorkoutForm;