// list all clients 
import { Container, Row, Col } from 'reactstrap';
import {useState, useEffect, useContext} from 'react';
import {useCookies} from 'react-cookie';
import useFetch from '../utils/useFetch';



const Clients = () => {
    const options = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    }
    const { loading, error, data: clients } = useFetch('http://localhost:8000/clients', options);


   

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