import { useState } from "react";

//going to be standard feed back for users to see about their workouts or lack of workouts

function WorkoutMsgs({ type, date }) {
  const [workoutMsgs, setWorkoutMsgs] = useState({
    completed: "Great job on completing your workout today!",
    none: "You have not completed a workout since " + date + ".",
  });

  return <h2>{type === 1 ? workoutMsgs.completed : workoutMsgs.none}</h2>;
}

export default WorkoutMsgs;
 