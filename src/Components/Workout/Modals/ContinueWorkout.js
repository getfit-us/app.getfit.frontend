import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useWorkouts } from "../../../Store/Store";
import { colors } from "../../../Store/colors";

const ContinueWorkout = ({
  modalOpenUnfinishedWorkout,
  setModalOpenUnFinishedWorkout,
  setStartWorkout,
}) => {
  const unfinishedWorkout = JSON.parse(localStorage.getItem("startWorkout"));
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const handleOpen = () => setModalOpenUnFinishedWorkout(true);
  const handleClose = () => setModalOpenUnFinishedWorkout(false);
  const clearStorage = () => {
    //clear unfinishedWorkout and close modal
    localStorage.removeItem("startWorkout");
    setManageWorkout({});
    handleClose();
  };

  const continueWorkout = () => {
    //set startWorkout to unfinishedWorkout and close modal
    setStartWorkout(unfinishedWorkout);
    handleClose();
  };

  if (unfinishedWorkout)
    return (
      <Dialog
        open={modalOpenUnfinishedWorkout}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="sm"
      >
        <div
          className="flex flex-center flex-column"
          style={{
            gap: "1rem",

            position: "relative",
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              backgroundColor: "#34adff",
              backgroundImage:
                "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
              padding: "2rem",
              color: "white",
              width: "100%",
            }}
          >
            {" "}
            Continue Workout ?
          </DialogTitle>
          <DialogContent style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <h3 style={{
              margin: "0",
            }}>Workout Title</h3>
            <h2> {unfinishedWorkout[0].name}</h2>
            <p>
              You have an unfinished workout. Would you like to continue where
              you left off? <br /> <span style={{
                
                fontWeight: "bold",
              }}>Clicking "No" will delete your unfinished work.</span>
            </p>
          </DialogContent>

          <IconButton
            aria-label="Close"
            onClick={handleClose}
            style={style.close}
          >
            <CloseIcon />
          </IconButton>
          <DialogActions
            style={{
              padding: "1rem",
              backgroundColor: "#34adff",
              backgroundImage:
                "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="medium"
              sx={{ align: "center", borderRadius: 20, mr: 2 }}
              onClick={continueWorkout}
              color="success"
            >
              Yes
            </Button>

            <Button
              variant="contained"
              size="medium"
              color="secondary"
              sx={{ align: "center", borderRadius: 20 }}
              onClick={clearStorage}
            >
              No
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
};

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    gap: 2,
  },
  form: {
    p: 3,
  },
  close: {
    position: "absolute",
    top: 3,
    right: 3,
    color: 'white'
  },
};

export default ContinueWorkout;
