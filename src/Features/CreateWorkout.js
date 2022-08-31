import { useState, useTheme } from "react";
import useProfile from "../utils/useProfile";

const CreateWorkout = ({ newWorkoutName }) => {
  const { state, dispatch } = useProfile();

  return (
    <div style={{marginTop: 20}}>
      <h4>CreateWorkout</h4>
      {newWorkoutName}
    </div>
  );
};

export default CreateWorkout;
