import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useWorkouts } from '../../Store/Store';

const ExerciseActions = ({ params, rowId, setRowId }) => {
    const axiosPrivate = useAxiosPrivate();
    const updateExercise = useWorkouts((state) => state.updateExercise);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

   

    const onUpdate = async () => {
        let isMounted = true;
        setLoading(true);
        
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.put('/exercises', params.row, { signal: controller.signal });
        
            setSuccess(true);
            setRowId(null);
            setLoading(false);
            updateExercise(response.data);
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

export default ExerciseActions;