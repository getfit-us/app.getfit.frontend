import {Container, Col, Row, } from 'reactstrap';
import { useForm } from "react-hook-form";



const AddExercise = () => {

    const { register, handleSubmit } = useForm();
    const onSubmit = data => console.log(data);

  return (
        <Container>
            <Row>
                <Col><h1>AddExercise Form</h1>
                </Col>
        
        </Row>
        <Row>
                <Col>
                <form onSubmit={handleSubmit(onSubmit)}>
                                    <input {...register("name")} />
      <select {...register("type")}>
        <option value="push">Push</option>
        <option value="pull">Pull</option>
        <option value="legs">Legs</option>
      </select>
      <input type="submit" />
    </form>
                </Col>
        
        </Row>
        
        </Container>


  )
}

export default AddExercise