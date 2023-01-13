import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useMediaQuery,
  TextField,
  MenuItem,
  Grid,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useWorkouts } from "../../../Store/Store";
import shallow from "zustand/shallow";
import { colors } from "../../../Store/colors";
import "./ExerciseHistory.css";

//need to add cache to limit the amount of data being pulled from the server
// also to limit calculation for the chart

const ExerciseHistory = ({ modalHistory, setModalHistory }) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);
  let width = 250;
  const exerciseHistory = useWorkouts(
    (state) => state.exerciseHistory,
    shallow
  );

  let exerciseType;
  if (exerciseHistory && exerciseHistory?.history?.length > 0) {
    exerciseType = exerciseHistory?.history[0]?.type || null;
  }

  // add chart data to array. Grab history and find max weight and reps

  const smScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

  const xsScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"), {
    defaultMatches: true,
    noSsr: false,
  });

  const mdScreen = useMediaQuery((theme) => theme.breakpoints.down("md"), {
    defaultMatches: true,
    noSsr: false,
  });
  const lgScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  if (lgScreen) width = 400;
  if (smScreen) width = 300;
  if (xsScreen) width = 250;

  //need to add chart showing max weight and reps
  return (
    <Dialog
      //Show Exercise History
      open={modalHistory}
      onClose={handleCloseHistoryModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll="body"
      sx={{ overflowX: "hidden" }}
    >
      <DialogTitle
        id="modal-modal-title"
        sx={{
          textAlign: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#34adff",
          backgroundImage:
            "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
        }}
      >
        Exercise History
      </DialogTitle>
      {/* loop over history state array and return Drop down Select With Dates */}
      <DialogContent dividers sx={{ overflowX: "hidden" }}>
        <Grid
          container
          justifyContent={"center"}
          flexDirection="column"
          spacing={0}
        >
          <TextField
            select
            label="Date"
            value={selected}
            fullWidth
            onChange={(e) => {
              setSelected(e.target.value);
            }}
          >
            {exerciseHistory?.history?.map((completedExercise, index) => {
              return (
                <MenuItem
                  key={
                    completedExercise._id +
                    completedExercise.dateCompleted +
                    "menu item" +
                    index
                  }
                  value={index}
                >
                  {new Date(
                    completedExercise.dateCompleted
                  ).toLocaleDateString()}
                </MenuItem>
              );
            })}
          </TextField>

          <h3 style={styles.exerciseName}>
            {exerciseHistory?.history && exerciseHistory?.history[0]?.name}
          </h3>
          {exerciseHistory?.history && exerciseType === "cardio" ? (
            <div>
              <p>
                <span >Level:</span>{" "}
                <span className="info">
                  {exerciseHistory?.history?.[selected]?.numOfSets[0].level}{" "}
                  (Level)
                </span>
              </p>
              <p>
                <span >Minutes:</span>{" "}
                <span className="info">
                  {exerciseHistory?.history?.[selected]?.numOfSets[0].minutes}{" "}
                  (Min)
                </span>
              </p>
              <p>
                <span >Heart Rate:</span>{" "}
                <span className="info">
                  {exerciseHistory?.history?.[selected]?.numOfSets[0].heartRate}{" "}
                  (HR)
                </span>
              </p>
            </div>
          ) : (
            exerciseHistory?.history?.[selected]?.numOfSets?.map((set, idx) => {
              return (
                <p
                  key={"set P tag" + idx + selected}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    margin: "0",
                  }}
                >
                  <span  key={"set label" + idx + selected}>
                    Set#
                    {idx + 1}{" "}
                  </span>
                  <span style={styles.field} key={"weight label" + idx + selected}>
                    {" "}
                    Weight:
                  </span>{" "}
                  <span style={styles.data} key={"weight info" + idx + selected}>
                    {set.weight} (lbs)
                  </span>{" "}
                  <span style={styles.field} key={"reps label" + idx + selected}>
                    Reps:{" "}
                  </span>
                  <span style={styles.data} key={"reps info" + idx + selected}>
                    {set.reps}
                  </span>
                </p>
              );
            })
          )}
          {exerciseHistory?.history?.[selected]?.notes && (
            <div
              style={{
                border: "2px solid black",
                display: "flex",
                borderRadius: 20,
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <h3
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {" "}
                Exercise Notes
              </h3>
              <p style={styles.notes}>
                {exerciseHistory?.history?.[selected]?.notes}
              </p>
            </div>
          )}
        </Grid>
      </DialogContent>{" "}
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#34adff",
          backgroundImage:
            "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
        }}
      >
        <h3>Last 20 Heaviest Loads</h3>
        <BarChart
          width={width}
          height={300}
          data={
            exerciseHistory.chartData?.length > 0
              ? exerciseHistory.chartData
              : [{ date: "No Data" }]
          }
          margin={{
            top: 1,
            bottom: 1,
            left: 0,
            right: 10,
          }}
          barSize={8}
          barGap={0.5}
          style={styles.chart}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "black" }} />
          <YAxis tick={{ fill: "black" }} />
          <Tooltip
            contentStyle={{
              opacity: 0.9,
              backgroundColor: "grey",
              color: "black",
              fontSize: "1.2rem",
            }}
          />
          <Legend />
          {exerciseType === "cardio" ? (
            <>
              <Bar dataKey="minutes" fill="white" />
              <Bar dataKey="heartRate" fill="black" />
              <Bar dataKey="level" fill="#4a3303" />
            </>
          ) : (
            <>
              <Bar dataKey="reps" fill="white" />
              <Bar dataKey="weight" fill="black" />
            </>
          )}
        </BarChart>

        <Button
          variant="contained"
          size="medium"
          color="secondary"
          sx={{
           
            mt: 2,
            mb: "1rem",
           
          }}
          onClick={() => {
            setSelected(0);
            handleCloseHistoryModal();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = {
  chart: {
    fontSize: ".9rem",
    fontWeight: "bold",
    backgroundColor: "",
    backgroundImage: "",
    color: "black",
    justifyContent: "center",
    display: "flex",

    margin: 2,
  },
  notes: {
    fontStyle: "italic",
    alignSelf: "center",
  },
  exerciseName: {
    padding: 1,
    alignSelf: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    color: colors.white,
    paddingRight: 10,
    paddingLeft: 10,
  },
  field: {
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  data: {
    color: colors.primary,
    fontStyle: "italic",
    fontSize: "1.2rem",
  },
};

export default ExerciseHistory;
