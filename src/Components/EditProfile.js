import {
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Password from "../Pages/Password";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import useProfile from "../utils/useProfile";
import { useForm } from "react-hook-form";

const EditProfile = () => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

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

  const updateProfile = async (data) => {
    let isMounted = true;
    setLoading(true);
    //set clientId
    data.id = state.profile.clientId;
    data.goal = [];
    //find goals and add to array
    const pattern = /goal+[0-9]/;
    for (const values in data) {
      if (pattern.test(values)) {
        data.goal.push(data[values]);
      }
    }

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(`/users/${data.id}`, data, {
        signal: controller.signal,
        withCredentials: true,
      });
      dispatch({
        type: "UPDATE_PROFILE",
        payload: response.data,
      });
      // console.log(response.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const styles = {
    h5: {
      padding: "1rem",
      backgroundColor: "#29282b",
      color: "white",
      borderRadius: "20px",
      textAlign: "center",
    },
    button: {
      boxShadow: " 7px 6px 6px -1px rgba(48,112,175,0.31)",
    },
    paper: {
      borderRadius: "10px",
    },
  };

  console.log(state.profile);
  return (
    <>
      <Paper elevation={2} style={styles.paper}>
        <Grid
          item
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h5" sx={{}}>
            Edit Profile
          </Typography>
        </Grid>
        <form>
          <Grid container spacing={1} sx={{ p: 1 }}>
            <Grid item xs={12} sm={6}>
              <h4 style={styles.h5}>Contact Info</h4>
              <TextField
                {...register("firstName", {
                  required: "Please Enter a first name",
                  min: 2,
                  max: 20,
                })}
                defaultValue={state.profile.firstName}
                label="First Name"
                type="text"
                fullWidth
                error={errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                sx={{ m: 1, pr: 1 }}
              />

              <TextField
                defaultValue={state.profile.lastName}
                label="Last Name"
                type="text"
                sx={{ m: 1, pr: 1 }}
                fullWidth
                {...register("lastName", {
                  required: "Please Enter a last name",
                  min: 2,
                  max: 20,
                })}
                error={errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ""}
              />

              <TextField
                defaultValue={state.profile.email}
                label="Email"
                type="text"
                fullWidth
                sx={{ m: 1, pr: 1 }}
                {...register("email", {
                  required: "Please Enter a valid email",
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Please enter a valid email address",
                  },
                })}
                error={errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                defaultValue={state.profile.phone}
                label="Phone"
                type="text"
                fullWidth
                sx={{ m: 1, pr: 1 }}
                {...register("phone", {
                  pattern: {
                    value: /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/,
                    message: "Please enter a valid phone number",
                  },
                })}
                error={errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <h4 style={styles.h5}>GOALS</h4>

              {state.profile.goal.map((goal, index) => (
                <TextField
                  sx={{ textAlign: "center", m: 1, pr: 1 }}
                  key={goal}
                  defaultValue={goal}
                  label="Goal"
                  type="text"
                  fullWidth
                  {...register(`goal${index}`)}
                />
              ))}
            </Grid>
          </Grid>
        </form>
        <Grid item align="end" sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(updateProfile)}
            style={styles.button}
          >
            Save Changes
          </Button>
        </Grid>
      </Paper>

      <Password />
    </>
  );
};

export default EditProfile;
