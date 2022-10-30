import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useMediaQuery,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
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

//**********   add a chart showing recent history

//if you check the history on the same day of the history it will not show up correctly
//something not working needs to be checked

const ExerciseHistory = ({
  modalHistory,
  setModalHistory,
  exerciseHistory,
  status,
}) => {
  const [selected, setSelected] = useState(0);
  const handleCloseHistoryModal = () => setModalHistory(false);
  let chartData = [];
  let width = 250;

  // add chart data to array. Grab history and find max weight and reps
  if (exerciseHistory) {
    console.log(exerciseHistory);
    let maxWeight = 0;
    let reps = 0;
   
    chartData = exerciseHistory.history.map((history) => {
     
      


      return {
        date: new Date(history.dateCompleted).toLocaleDateString(),
        weight: maxWeight,

        reps: reps,
      };
    });
  }

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
  console.log(chartData);
  if (!status.loading)
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
                  <MenuItem key={index + 2} value={index}>
                    {new Date(
                      completedExercise.dateCompleted
                    ).toLocaleDateString()}
                  </MenuItem>
                );
              })}
            </TextField>

            <h3>{exerciseHistory?.history[0]?.name}</h3>
            {exerciseHistory?.history &&
              exerciseHistory?.history?.[selected]?.numOfSets?.map(
                (set, idx) => {
                  return (
                    <>
                      <p key={idx}>
                        <span className="title">Set:</span> {idx + 1}
                        <span className="title"> Weight:</span>{" "}
                        <span className="info">{set.weight}lbs</span>{" "}
                        <span className="title">Reps:</span>
                        <span className="info">{set.reps}</span>
                      </p>
                    </>
                  );
                }
              )}
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
              data={chartData}
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
