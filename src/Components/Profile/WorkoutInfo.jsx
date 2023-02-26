import { Paper, Rating } from "@mui/material";
import React from "react";
import "./WorkoutInfo.css";

const WorkoutInfo = ({ completedWorkouts, profile }) => {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timestampThirtyInPast = new Date().getTime() - sevenDaysInMs;

  const lastWorkout = completedWorkouts[completedWorkouts?.length - 1];
  const lastWorkoutDate = new Date(lastWorkout?.dateCompleted);
  const hasNotWorkedOutInAWeek =
    new Date(timestampThirtyInPast) > lastWorkoutDate;
  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: "20px" }}
      className="workout-info-card"
    >
      <h2 className="page-title">Workout Stats</h2>
      <div className="workout-card-details">
        <ul>
          <li>
            Last Workout:{" "}
            <span>
              {lastWorkout
                ? lastWorkoutDate?.toDateString()
                : "No Workouts Found"}
            </span>{" "}
          </li>
          <li>
            Workout Name:{" "}
            <span>{lastWorkout ? lastWorkout.name : "No Workout Found"}</span>
          </li>
          <li>
            {" "}
            Rating:{" "}
            <Rating
              size="small"
              value={completedWorkouts[completedWorkouts?.length - 1]?.rating}
              readOnly
            />
          </li>
          <li>
            {" "}
            Feedback:{" "}
            <span>
              {lastWorkout?.feedBack
                ? lastWorkout?.feedBack
                : "No Workout Feedback Found"}
            </span>
          </li>
          {hasNotWorkedOutInAWeek && (
            <li className="error-workout">
              It has been more then one week since you have logged a workout.
            </li>
          )}
        </ul>
      </div>
    </Paper>
  );
};

export default WorkoutInfo;
