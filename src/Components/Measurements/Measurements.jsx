import { Add, RemoveCircle, Save } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Snackbar,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import MeasurementChart from "./MeasurementChart";
import { useProfile } from "../../Store/Store";
import useSWR from "swr";

const Measurements = ({ clientId, trainerMeasurements }) => {
  const profile = useProfile((state) => state.profile);
  const addMeasurement = useProfile((state) => state.addMeasurement);
  const axiosPrivate = useAxiosPrivate();
  const setMeasurements = useProfile((state) => state.setMeasurements);

  const { data: measurements, error: errorMeasurement, isLoading } = useSWR(`/measurements/${profile.clientId}`, (url) => getSWR(url, axiosPrivate), {
    onSuccess: (data) => setMeasurements(data),
  });


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [files, setFiles] = useState();
  const [status, setStatus] = useState({
    error: false,
    success: false,
    loading: false,
    message: null,
  });
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
  const {
    handleSubmit,
    reset,

    formState: { errors },
    register,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onBlur",
  });
  const handleSnackbar = () => {
    setOpenSnackbar((prev) => !prev);
  };

  //set page title
  document.title = "Measurements";

  const handleAddMeasurement = (measurement) => {
    const formData = new FormData();
    if (files) {
      files.map((file) => {
        formData.append(file.name, file);
        if (file.view === "0") formData.append("front", file.name);
        if (file.view === "1") formData.append("side", file.name);
        if (file.view === "2") formData.append("back", file.name);
      });
    }
    //add client id to req so the image can be tagged to client. either from profile or from props (trainer managing client)
    clientId?.length > 0
      ? formData.append("id", clientId)
      : formData.append("id", profile.clientId);

    // formData.append(values);
    formData.append("weight", measurement.weight);
    formData.append("bodyfat", measurement.bodyfat);
    formData.append("date", measurement.date);

    addMeasurementApi(axiosPrivate, formData).then((res) => {
      setStatus({ loading: res.loading, error: res.error });
      if (res.error) {
        setStatus({
          message:
            res.data.response.status === 409
              ? "Measurement already exists"
              : "Error adding measurement",
          error: res.error,
        });
      } else {
        setStatus({ success: true });
        if (clientId === undefined) {
          // if component is not being managed by trainer then update the state
          addMeasurement(res.data);
        }

        setFiles([]); //reset files array
        setStatus((prev) => ({ ...prev, loading: false, success: true }));
        reset(); //reset form values
        setTimeout(() => {
          setStatus((prev) => ({ ...prev, loading: false, success: false }));
        }, 5000);

        setTimeout(() => {
          setStatus((prev) => ({ ...prev, loading: false, success: false }));
        }, 2000);
      }
    });
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount

    if (files) {
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }
  }, []);

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
          <Grid item xs={12} sx={{ m: 2 }}>
            <h2 className="page-title">New Measurement</h2>
          </Grid>

          <Grid
            item
            xs={12}
            sm={2}
            sx={{ display: "flex", justifyContent: "start" }}
          >
            <TextField
              name="date"
              label="Date"
              size="small"
              fullWidth={true}
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
          <Grid
            item
            xs={12}
            sm={2}
            sx={{ display: "flex", justifyContent: "flex-start" }}
          >
            <TextField
              size="small"
              name="weight"
              label="Body Weight (lbs)"
              type="number"
              fullWidth
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
          <Grid
            item
            xs={12}
            sm={2}
            sx={{ display: "flex", justifyContent: "flex-start" }}
          >
            <TextField
              fullWidth
              size="small"
              name="bodyfat"
              label="Body Fat"
              type="number"
              {...register("bodyfat")}
              errors={errors.bodyfat}
              helperText={errors.bodyfat ? errors.bodyfat.message : " "}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
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
            {files && (
              <ImageList cols={smDN ? 1 : 2}>
                {files.map((file, index) => (
                    <ImageListItem key={file.name}>
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
                            : file.view === undefined
                            ? "Pick A View"
                            : "Back View"
                        }
                        actionIcon={
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label={`Remove`}
                            onClick={() => {
                              //remove the current file from state
                              setFiles((prev) => {
                                // need to fix this to update preview on each file after removeing one

                                let updated = [];
                                prev.map((prevfile) => {
                                  if (prevfile.name !== file.name) {
                                    updated.push(prevfile);
                                    Object.assign(prevfile, {
                                      preview: URL.createObjectURL(prevfile),
                                    });
                                  }
                                });
                                return updated;
                              });
                            }}
                          >
                            <RemoveCircle />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                ))}
              </ImageList>
            )}
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

          <Grid item xs={12} sm={6} sx={{ mt: 3, mb: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              // onClick={handleSubmit(onSubmit)}
              color={
                status.error ? "error" : status.success ? "success" : "primary"
              }
              onClick={
                () => {
                  if (files !== undefined && files.length > 0) {
                    const dups = new Set();
                    files?.map((file) => dups?.add(file.view));

                    if (dups.size !== files?.length) {
                      //open error message
                      handleSnackbar();
                      return false;
                    } else if (dups.size === files.length) {
                      //reorder files based on view selection
                      setFiles((prev) => prev.sort((a, b) => a.view - b.view));
                      //need to account for maybe only two images look at view selected and move items in array to appropriate position
                    }
                  }
                  handleSubmit(handleAddMeasurement)();
                }
                // // check if any view is selected twice

                // if no files are selected submit
              }
              startIcon={<Save />}
              sx={{ mr: 1, mb: { xs: 1, md: 1, lg: 0 } }}
            >
              {status.loading
                ? "Saving..."
                : status.error
                ? status.message
                : status.success
                ? "Success"
                : "Save Measurement"}
            </Button>

            <Button variant="contained" onClick={open} startIcon={<Add />}>
              Add Images
            </Button>
          </Grid>
        </Grid>
      </form>
      {loadingMeasurements && measurements?.length === 0 ? (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Skeleton
            variant="rectangular"
            width={400}
            height={50}
            animation="wave"
            sx={{ mt: 1, mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={400}
            height={50}
            animation="wave"
            sx={{ mt: 1, mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={400}
            height={140}
            animation="wave"
            sx={{ mt: 1, mb: 1 }}
          />
        </Grid>
      ) : (
        <Paper elevation={3} sx={{ p: 1, borderRadius: 5, mb: 5 }}>
          <MeasurementChart
            width={smDN ? 300 : 500}
            barSize={smDN ? 5 : 10}
            measurements={
              trainerMeasurements ? trainerMeasurements : measurements
            }
          />
        </Paper>
      )}
    </Grid>
  );
};

const styles = {
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
    padding: "4px",
    marginBottom: "10px",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    textAlign: "center",
    color: "#fff",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
};
export default Measurements;
