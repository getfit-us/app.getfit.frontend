import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// working on saving orientation changes

const MeasurementSaveDialog = ({ openDialog, setOpenDialog, files }) => {
  const [selectedValue, setSelectedValue] = React.useState({
    front: 0,
    side: 1,
    back: 2,
  });

//   const handleChange = (event) => {
//     console.log(event.target.value, index);
//     //   setSelectedValue((prev => {...prev, }));
//   };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  console.log(files, selectedValue);
  return (
    <div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="Confirm Measurement Save"
      >
        <DialogTitle>{"Progress Picture Orientation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="Confirm Measurement Save">
            {files &&
              files.map((file, index) => (
                <Grid style={styles.thumbsContainer}>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      View
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={index}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Front"
                        onChange={(event) => {
                          setSelectedValue((prev) => ({
                            ...prev,
                            front: index,
                          }));
                        }}
                      />
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Side"
                        onChange={(event) => {
                          setSelectedValue((prev) => ({
                            ...prev,
                            side: index,
                          }));
                        }}
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Back"
                        onChange={(event) => {
                          setSelectedValue((prev) => ({
                            ...prev,
                            back: index,
                          }));
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Grid style={styles.thumb} key={file.name}>
                    <Grid style={styles.thumbInner}>
                      <img
                        src={file.preview}
                        style={styles.img}
                        alt="Progress Pictures"
                        // Revoke data uri after image is loaded
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Grid item xs={12} sx={{display:'flex', justifyContent:'center'}}>
         
          <Button variant="contained" color='success' startIcon={<Save />}>Save</Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "center",
  },

  thumb: {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200,
    padding: 4,
    boxSizing: "border-box",
  },

  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  },

  img: {
    display: "block",
    width: "auto",
    height: "100%",
  },
};

export default MeasurementSaveDialog;
