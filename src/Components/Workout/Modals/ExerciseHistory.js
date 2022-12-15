import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMediaQuery, TextField, MenuItem, Grid } from "@mui/material";
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

//need to add cache to limit the amount of data being pulled from the server
// also to limit calculation for the chart

const ExerciseHistory = ({
  modalHistory,
  setModalHistory,
}) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);
  let width = 250;  
  const exerciseHistory = useWorkouts((state) => state.exerciseHistory, shallow);


  

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
  if (smScreen) width = 250;
  if (xsScreen) width = 250;
  //need to add chart showing max weight and reps

  return (
    <Dialog
      //Show Exercise History
      open={modalHistory}
      onClose={handleCloseHistoryModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll="paper"
      sx={{ overflowX: "hidden" }}
    >
      <DialogTitle
        id="modal-modal-title"
        sx={{
          textAlign: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
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
                  key={completedExercise._id + completedExercise.dateCompleted + "menu item"}
                  value={index}
                >
                  {new Date(
                    completedExercise.dateCompleted
                  ).toLocaleDateString()}
                </MenuItem>
              );
            })}
          </TextField>

          <h3>{exerciseHistory?.history && exerciseHistory?.history[0]?.name}</h3>
          {exerciseHistory?.history &&
            exerciseHistory?.history?.[selected]?.numOfSets?.map((set, idx) => {
              return (
                <>
                  <p key={"set P tag" + idx + selected }>
                    <span className="title" key={"set label" + idx+ selected}>
                      Set:
                    </span>{" "}
                    {idx + 1}
                    <span className="title" key={"weight label" + idx + selected}>
                      {" "}
                      Weight:
                    </span>{" "}
                    <span className="info" key={"weight info" + idx+ selected}>
                      {set.weight}lbs
                    </span>{" "}
                    <span className="title" key={"reps label" + idx + selected}>
                      Reps:
                    </span>
                    <span className="info" key={"reps info" + idx+ selected}>
                      {set.reps}
                    </span>
                  </p>
                </>
              );
            })}
          {exerciseHistory?.history?.[selected]?.notes && (
            <p>
              <span className="title">Exercise Notes:</span>{" "}
              <span className="info">
                {exerciseHistory?.history?.[selected]?.notes}
              </span>
            </p>
          )}
          <BarChart
            width={width}
            height={300}
            data={exerciseHistory.chartData}
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
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip contentStyle={{ opacity: 0.9 }} />
            <Legend />

            <Bar dataKey="reps" fill="#800923" />
            <Bar dataKey="weight" fill="#3070af" />
          </BarChart>

          <Button
            variant="contained"
            size="medium"
            color="warning"
            sx={{ borderRadius: 20, mt: 2, mb: "1rem" }}
            onClick={() => {
              setSelected(0);
              handleCloseHistoryModal();
            }}
          >
            Close
          </Button>
        </Grid>
      </DialogContent>{" "}
    </Dialog>
  );
};

const styles = {
  chart: {
    fontSize: ".9rem",
    fontWeight: "bold",
    backgroundColor: "",
    backgroundImage: "",
    boxShadow: "2px #00e9a6",

    justifyContent: "center",
    display: "flex",

    margin: 2,
  },
};

export default ExerciseHistory;
