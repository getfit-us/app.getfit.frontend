import { Add, Cancel } from "@mui/icons-material";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import useProfile from "../../utils/useProfile";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import { useForm } from "react-hook-form";
import MeasurementChart from "./MeasurementChart";

const Measurements = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    maxFiles: 3,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
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
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const [files, setFiles] = useState();
  const [error, setError] = useState();

  const onSubmit = async (data) => {
    let isMounted = true;

    const formData = new FormData();
    if (acceptedFiles) {
      acceptedFiles.map((file) => formData.append(file.name, file));
    }
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);
    formData.append("weight", data.weight);
    formData.append("bodyfat", data.bodyfat);
    formData.append("date", data.date);

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
            <Typography variant="h4" style={styles.title}>
              New Measurement
            </Typography>
          </Grid>

          <Grid item>
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
          <Grid item>
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
          <Grid item>
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
            <p style={styles.p}>Drag 'n' drop Front Facing Image here</p>
           {/* need to add boxes for front side  back  */}
         
              {files &&
                files.map((file, index) => (
                  <Grid style={styles.thumbsContainer}>
                      <p>{index === 0 ? 'Front Preview' : index === 1 ? 'Back Preview' : 'Side Preview'}</p>

                  <Grid style={styles.thumb} key={file.name}>
                    
                    <Grid style={styles.thumbInner}>
                      <img
                        src={file.preview}
                        style={styles.img}
                        alt={index === 0 ? 'Front Preview' : index === 1 ? 'Back Preview' : 'Side Preview'}
                        // Revoke data uri after image is loaded
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                      />
                    </Grid>
                  </Grid>
                  </Grid>
                ))}
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mt: 3, mb: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              startIcon={<Add />}
            >
              Add Measurement
            </Button>
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
    width: 100,
    height: 100,
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

  p: {
    textAlign: "center",
  },
  title: {
    padding: "10px",
    marginBottom: '10px',
    border: "5px solid black",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    textAlign: "center",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
};
export default Measurements;
