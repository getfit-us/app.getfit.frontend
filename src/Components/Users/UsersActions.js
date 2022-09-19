import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const UsersActions = ({ params, rowId, setRowId, setUsers, users }) => {
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

  

    const onUpdate = async () => {
        let isMounted = true;
        setLoading(true);
        

        const controller = new AbortController();
        try {
            const response = await axiosPrivate.put('/users', params.row, { signal: controller.signal });
            console.log(response.data);
            const updatedUsers = users.map(user => user._id === response.data._id ? response.data : user)
            setUsers(updatedUsers);
            setSuccess(true);
            setRowId(null);
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }

    }




    useEffect(() => {
        if (rowId === params.id && success) setSuccess(false);
    }, [rowId]);

    return (
        <Box
            sx={{
                m: 1,
                position: 'relative',
            }}
        >
            {success ? (
                <Fab
                    color="primary"
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: green[500],
                        '&:hover': { bgcolor: green[700] },
                    }}
                >
                    <Check />
                </Fab>
            ) : (
                <Fab
                    color="primary"
                    sx={{
                        width: 40,
                        height: 40,
                    }}
                    disabled={params.id !== rowId || loading}
                    onClick={onUpdate}
                >
                    <Save />
                </Fab>
            )}
            {loading && (
                <CircularProgress
                    size={52}
                    sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                    }}
                />
            )}
        </Box>
    );
};

export default UsersActions;