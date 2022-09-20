import { Add, Cancel, Remove, RemoveCircle, Save } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useProfile from "../../hooks/useProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import MeasurementChart from "./MeasurementChart";

const Measurements = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [files, setFiles] = useState();
  const [error, setError] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    maxFiles: 3,
    noClick: true,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file, index) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            // view: index,
          })
        )
      );
     
    
    },
  });
  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useProfile();
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    register,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
  });
  const handleSnackbar = () => {
    setOpenSnackbar((prev) => !prev);
  };

  //set page title
  document.title = "Measurements";

  const onSubmit = async (data) => {
    let isMounted = true;

    const formData = new FormData();
    if (files) {
      files.map((file) => formData.append(file.name, file));
    }
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);
    formData.append("weight", data.weight);
    formData.append("bodyfat", data.bodyfat);
    formData.append("date", data.date);

    console.log(formData)
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/measurements", formData, {
        signal: controller.signal,
      });

      dispatch({ type: "ADD_MEASUREMENT", payload: response.data });
      reset(); //reset form values
      setFiles([]); //reset files
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount

    if (files) {
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }
  }, []);

  console.log(state.measurements)

  return (
    <Grid
      container
      sx={{
        mt: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form encType="multipart/form-data">
        <Grid
          container
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Grid item xs={12} sm={12} sx={{ m: 2 }}>
            <Typography variant="h4" style={styles.title}>
              New Measurement
            </Typography>
          </Grid>

          <Grid item xs={12} sm={2} sx={{display: 'inherit', justifyContent: 'center'}}>
            <TextField
              name="date"
              label="Date"
              InputLabelProps={{ shrink: true, required: true }}
              type="date"
              {...register("date", {
                required: "Please select the date of measurement",
                pattern: {
                  value: /^{|2[0-9]{3}-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
                  message: "Please select a valid date",
                },
              })}
              error={errors.date}
              helperText={errors.date ? errors.date.message : " "}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{display: 'inherit', justifyContent: 'center'}}>
            <TextField
              name="weight"
              label="Body Weight (lbs)"
              type="number"
              {...register("weight", {
                required: "Please enter a valid weight",
                min: {
                  value: 75,
                  message: "Please enter a valid weight",
                },
                max: {
                  value: 600,
                  message: "Please enter a valid weight",
                },
                valueAsNumber: true,
              })}
              error={errors.weight}
              helperText={errors.weight ? errors.weight.message : " "}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{display: 'inherit', justifyContent: 'center'}}>
            <TextField
              name="bodyfat"
              label="Body Fat"
              type="number"
              {...register("bodyfat")}
              error={errors.bodyfat}
              helperText={errors.bodyfat ? errors.bodyfat.message : " "}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              mt: 3,
              p: 3,
              border: 2,
              justifyItems: "center",
              marginLeft: "8px",
            }}
            {...getRootProps({ className: "dropzone" })}
            id="dropzone"
          >
            <TextField {...getInputProps()} name="files" id="frontImage" />
         
            <p style={styles.p}>
              Up to 3 images - Front Facing, Side, and Back
              
            </p>
            {/* need to add boxes for front side  back  */}
            <ImageList cols={smDN ? 1 : 2}>
              {/* <Grid  container  style={styles.thumbsContainer}> */}
              {files &&
                files.map((file, index) => (
                  <>
                    <ImageListItem key={file.name}>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            row
                          >
                            <FormControlLabel
                              labelPlacement="top"
                              value={0}
                              control={<Radio />}
                              label="Front"
                              onChange={(event) => {
                                setFiles((prev) => {
                                  const updated = [...prev];

                                  updated[index].view = event.target.value;
                                  return updated;
                                });
                              }}
                            />
                            <FormControlLabel
                              labelPlacement="top"
                              value={1}
                              control={<Radio />}
                              label="Side"
                              onChange={(event) => {
                                setFiles((prev) => {
                                  const updated = [...prev];

                                  updated[index].view = event.target.value;
                                  return updated;
                                });
                              }}
                            />
                            <FormControlLabel
                             labelPlacement="top"
                              value={2}
                              control={<Radio />}
                              label="Back"
                              onChange={(event) => {
                                setFiles((prev) => {
                                  const updated = [...prev];

                                  updated[index].view = event.target.value;
                                  return updated;
                                });
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <img
                        src={file.preview}
                        srcSet={`${file.preview}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={"Progress preview"}
                        loading="lazy"
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                      />
                      <ImageListItemBar
                        title={
                          file.view === "0"
                            ? "Front View"
                            : file.view === "1"
                            ? "Side View"
                            : file.view === undefined ? "Pick A View" : "Back View"
                        }
                        actionIcon={
                          <IconButton
                            sx={{ color: 'white' }}
                            aria-label={`Remove`}
                            onClick={() => {
                              //remove the current file from state
                              setFiles((prev) => prev.filter((f) => f.name !== file.name));
                              }}
                          >
                            <RemoveCircle />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  </>
                ))}
            </ImageList>
          </Grid>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openSnackbar}
            onClose={handleSnackbar}
          >
            <Alert
              onClose={handleSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              More then one image has the same view selected.
            </Alert>
          </Snackbar>

          <Grid item xs={12} sm={6} sx={{ mt: 3, mb: 3, textAlign: "center",  }}>
            <Button
              variant="contained"
              // onClick={handleSubmit(onSubmit)}

              onClick={() => {
                
                if (files === undefined)  {
                  handleSubmit(onSubmit)()
                }
                // // check if any view is selected twice
                const dups = new Set();
                files?.map((file) => dups.add(file.view));

                if (dups.size !== files?.length) {
                  //open error message
                  console.log(dups);
                  handleSnackbar();
                } else if (dups.size === files.length) {
                  console.log('inside else if')
                    //reorder files based on view selection
                  setFiles((prev) => prev.sort((a, b) => a.view - b.view));
               
                  handleSubmit(onSubmit)()
                }

                // if no files are selected submit
               
              
                console.log(files)
                

              }}
              startIcon={<Save />}
              sx={{mr: 1, mb: {xs: 1, md: 1, lg: 0}}}
            >
              Save Measurement
            </Button>
            <Button variant="contained" onClick={open} startIcon={<Add />}>Add Images</Button>
          </Grid>
        
        </Grid>
      </form>
      {state.measurements[0] && (
        <Card elevation={3} sx={{ backgroundColor: "#e9eff2" }}>
          <CardHeader></CardHeader>

          <MeasurementChart width={700} />
        </Card>
      )}
    </Grid>
  );
};

const styles = {
  thumbsContainer: {
    // display: "flex",
    // flexDirection: "row",
    // marginTop: 7,
    // justifyContent: "center",
    // alignItems: "center",
    // flexWrap: "wrap",
  },

  thumb: {
    display: "inline-flex",
    borderRadius: 2,

    marginBottom: 0,
    marginRight: 0,
    width: "auto",
    height: 200,
    padding: 4,
    boxSizing: "border-box",
    justifyContent: "center",
  },

  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
    alignItems: "center",
  },

  img: {
    display: "block",
    width: "auto",
    height: "100%",
  },

  p: {
    textAlign: "center",
  },
  title: {
    padding: "10px",
    marginBottom: "10px",
    border: "5px solid black",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    textAlign: "center",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
};
export default Measurements;
