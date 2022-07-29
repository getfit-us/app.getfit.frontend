import {useState, useEffect}  from 'react';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import {useNavigate, useLocation} from 'react-router-dom';

//need to update -- copy the clients page 


const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', { signal: controller.signal });
                console.log(response.data);
                isMounted && setUsers(response.data);
                
            }   
            catch (err) {
                console.log(err);
                //save last page so they return back to page before re auth. 
                navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        }

    },[])


    return (

        <article>
            <h2>Users list</h2>
            {users?.length
               ? (
                <ul>
                    {users.map((user, index) => <li key={index}>{user?.email} {user?.firstName} {user?.lastName} </li>)}
                </ul>


               ) : <p>No users found.</p>
            
            
            }
            </article>
    )


}


export default Users;
