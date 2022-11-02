import { Close, Star } from "@mui/icons-material";
import {
  Button,
  Grid,
  
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const GoalModal = ({ goal, open, handleModal }) => {


 
    return (
      <Dialog
        open={open}
        onClose={handleModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Grid
          container
          spacing={0}
          sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}
        >
          <DialogTitle
            id="scroll-dialog-title"
            sx={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
          {goal?.title}
          </DialogTitle>

          <DialogContent dividers>
            {Date(goal?.start)}
            {Date(goal?.end)}



          </DialogContent>
          <Grid item xs={12} align="center">
            <Button
              onClick={handleModal}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, bgcolor: "#689ee1" }}
              endIcon={<Close />}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default GoalModal;
