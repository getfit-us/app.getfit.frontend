// list all clients 
import { Container, Row, Col } from 'reactstrap';
import { useState, useEffect, useContext } from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';




const Clients = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();

        const getClients = async () => {
            try {
                const response = await axiosPrivate.get('/clients', { signal: controller.signal });
                console.log(response.data);
                isMounted && setClients(response.data);
                setLoading(false)

            }
            catch (err) {
                console.log(err);
                setError(err);
                //save last page so they return back to page before re auth. 
                // navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getClients();
        return () => {
            isMounted = false;
            controller.abort();
        }

    }, [])





    console.log(clients)








    return (


        <Container>
            <Row>
                
                    {/* {loading && <p>Loading...</p>} */}
                    
                            {clients.map((client) => {
                                return (
                                    <Col md='5' className='m-4' key={client.id}>
                                        <a href={client.id}>  {client.firstName} {client.lastName} </a>
                                        {client.email}
                                    </Col>
                                )
                                })
                            }

                            
                    





                
            </Row>
        </Container>



    )
}


















export default Clients;