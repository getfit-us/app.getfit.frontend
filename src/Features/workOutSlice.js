
import WORKOUTS from '../shared/WORKOUTS';


export const selectAllWorkouts=  () => {
    return WORKOUTS;
};


export const selectWorkoutBy = (id) => {
    return WORKOUTS.find((workout) => workout.id === parseInt(id));
};

export const selectWorkoutByUser = () => {
    return WORKOUTS.find((workout) => workout.user);
};