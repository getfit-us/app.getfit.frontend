import { Close, Save, VapingRoomsRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const ViewMeasurementModal = ({ viewMeasurement, open, handleModal }) => {
  const { state, dispatch } = useProfile();
  const [error, setError] = useState();
  
  const axiosPrivate = useAxiosPrivate();
  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  const hasImages = viewMeasurement[0]?.images?.length > 0;

  // find views


  const onSubmit = async (data) => {
    let isMounted = true;
    const notes = document.getElementById("notes").value;
    //add client id to req so the image can be tagged to client.
    data.notes = notes;
    console.log(data);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/measurements", data, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "UPDATE_MEASUREMENT", payload: response.data });
      handleModal();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  // for viewing measurements
  return (
    <Dialog
      open={open}
      onClose={handleModal}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <Grid
        container
        spacing={0}
        sx={{ justifyContent: "start", alignItems: "center", mt: 1 }}
      >
        <Grid item xs={12} sx={{ position: "relative" }}>
          <DialogTitle
            id="scroll-dialog-title"
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            {new Date(viewMeasurement[0]?.date).toDateString()}
          </DialogTitle>
          <IconButton
            onClick={handleModal}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <Close />{" "}
          </IconButton>
        </Grid>

        <DialogContent dividers="paper">
          <Grid item xs={12} align="center">
            <span style={styles.span}></span>
          </Grid>
          <Grid item xs={12} align="center">
            <p>
              <span style={styles.span}>Weight: </span>
              <span style={styles.tableTextLoad}>
                {" "}
                {viewMeasurement[0]?.weight}{" "}
              </span>{" "}
              <span style={styles.span}>(lbs) Bodyfat:</span>
              <span style={styles.tableTextReps}>
                {viewMeasurement[0]?.bodyfat}
              </span>
            </p>
          </Grid>
          <Grid item xs={12} align="center">
            <TextField
              multiline
              minRows={3}
              label="Notes"
              name="notes"
              id="notes"
              defaultValue={viewMeasurement[0]?.notes}
              fullWidth
            />
          </Grid>
          {/* if there are pictures */}
          <ImageList cols={smDN ? 1 : 2}>
            {hasImages && viewMeasurement[0].images.map((image, index) => { 
              return image.includes('front') ? (
            
              <>
                <ImageListItem key={index + image}>
                  <img
                    src={`http://localhost:8000/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Front`}
                    // subtitle={<span>by: {item.author}</span>}
                    align="center"
                  />
                </ImageListItem>
                </>
                 ) :  image.includes('side') ? ( <ImageListItem key={index + image}>
                  <img
                    src={`http://localhost:8000/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Side`}
                    // subtitle={<span>by: {item.author}</span>}
                    align="center"
                  />
                </ImageListItem> ):  (<ImageListItem key={index + image}>
                  <img
                    src={`http://localhost:8000/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Back`}
                    // subtitle={<span>by: {item.author}</span>}
                    align="center"
                  />
                </ImageListItem>)

                  
                })}
          </ImageList>
        </DialogContent>
        <Grid item xs={12} align="center">
          <Button
            onClick={() => onSubmit(viewMeasurement[0])}
            variant="contained"
            size="large"
            color="success"
            sx={{ mt: 3, mb: 2 }}
            endIcon={<Save />}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    maxHeight: "90%",
    minWidth: "250px",
    bgcolor: "background.paper",
    border: "2px solid #474a48",
    boxShadow: 24,
    p: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  span: {
    fontWeight: "600",
  },
  tableTextLoad: {
    color: "red",
  },
  tableTextReps: {
    color: "blue",
  },
  tableColumns: {
    textDecoration: "underline",
  },
};

export default ViewMeasurementModal;
