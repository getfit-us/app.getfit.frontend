// list all clients 
import { Container, Row, Col } from 'reactstrap';
import {useState, useEffect, useContext} from 'react';
import {useCookies} from 'react-cookie';
import useFetch from '../utils/useFetch';
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider';


const Clients = () => {
    const { auth } = useContext(AuthContext);

    const { loading, error, data: clients } = useFetch('http://localhost:8000/clients');

    console.log(auth.accessToken);


    useEffect(() => {

        // if (token === undefined) {
        //     <Navigate to='/login'/>
        // }


        // console.log(token);
        // console.log('token set')

       

    },[])

   

    return (

        
            <Container>
            <Row>
                <Col>

                    {error && <p>Error loading Client List</p>}
                    {loading && <p>Loading...</p>}

                    {clients && clients.map((client) => {
                        return (
                            <Col md='5' className='m-4' key={client.id}>
                                <a href={client.id}>  {client.firstName} {client.lastName} </a>
                                {client.email}
                            </Col>
                        );
                    })}
                </Col>
            </Row>
        </Container>
        
        
        ) 
    } 

   
    
        
         
    
    
    
    


    
                
    

    


export default Clients;