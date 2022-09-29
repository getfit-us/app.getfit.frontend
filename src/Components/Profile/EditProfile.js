import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Password from "../../Pages/Password";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import { useForm } from "react-hook-form";
import { Add, Remove } from "@mui/icons-material";

const EditProfile = () => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    register,
    unregister
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
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
      setSuccess((prev) => !prev);
      setLoading(false);
      setTimeout(() => {
        setSuccess((prev) => !prev);
      }, 5000);
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
          <Grid container spacing={1} gap={1} sx={{ p: 1 }}>
            <Grid item xs={12} sm={6}>
              <h4 style={styles.h5}>Contact Info</h4>
              <TextField
                {...register("firstName", {
                  required: "Please Enter a first name",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "First name must be at most 20 characters long",
                  },
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
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Last name must be at most 20 characters long",
                  },
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
                  required: "Please enter a valid phone number",
                  pattern: {
                    value: /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/,
                    message: "Please enter a valid phone number",
                  },

                  minLength: {
                    value: 10,
                    message: "Phone numbers must be 10 numbers",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone numbers must be 10 numbers",
                  },
                })}
                error={errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
              />
              <TextField
                defaultValue={state.profile.age}
                label="Age"
                type="text"
                fullWidth
                sx={{ m: 1, pr: 1 }}
                {...register("age", {
                  required: "Please enter a valid age",
                  minLength: 1,
                  max: 99,
                  valueAsNumber: true,

                  message: "Please enter a valid age",
                })}
                error={errors.age}
                helperText={errors.age ? errors.age.message : ""}
              />
            </Grid>

            <Grid container xs={12} sm={5}   sx={{p: 1, }}>
              <Grid item xs={12} sx={{}}> <h4 style={styles.h5}>GOALS</h4> </Grid>
              {state.profile.goals?.length === 0 && ( 
                 <Grid item xs={12}>
                 <TextField
                   sx={{ textAlign: "center", m: 1, pr: 1 }}
                  
                   defaultValue="Set a new goal!"
                   label={`Goal #1`}
                   type="text"
                   minRows={2}
                   multiline
                   // fullWidth={idx >= 1 ? false : true}
                   {...register(`goal0`)}
                 />
                 </Grid>
              )
                }

              {state.profile.goal.map((goal, idx) => (
                <Grid item xs={12}>
                  <TextField
                    sx={{ textAlign: "center", m: 1, pr: 1 }}
                    key={goal}
                    defaultValue={goal}
                    label={idx >= 1 ? `Goal #${idx + 1}` : `Goal #1`}
                    type="text"
                    minRows={2}
                    multiline
                    // fullWidth={idx >= 1 ? false : true}
                    {...register(`goal${idx}`)}
                  />
                  {idx >= 1 ? (
                    <Tooltip
                      title="Remove"
                      sx={{ justifyContent: "center", alignContent: "center" }}
                    >
                      <IconButton
                        onClick={() => {
                          const newGoals = state.profile.goal.filter((g) => {
                            return g !== state.profile.goal[idx];
                          });
                          dispatch({
                            type: "UPDATE_GOALS",
                            payload: newGoals,
                          });
                          //remove inputs from form hook
                          unregister(`goal${idx}`);
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Tooltip>
                  ) :  <Tooltip
                  title="Add"
                  sx={{ justifyContent: "center", alignContent: "center" }}
                >
                  <IconButton
                    onClick={() => {
                      const newGoals = [...state.profile.goal]
                      newGoals.push([])
                      dispatch({
                        type: "UPDATE_GOALS",
                        payload: newGoals,
                      });
                      //remove inputs from form hook
                      register(`goal${idx}`);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </form>
        <Grid item align="end" sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(updateProfile)}
            color={success ? "success" : "primary"}
          >
            {success ? "Successfully Updated" : "Save Changes"}
          </Button>
        </Grid>
      </Paper>
            <Grid container xs={12} sm={6} md={4} sx={{display: 'flex', justifyContent: 'start', mt: 3,}}>   <Password /></Grid>
    
    </>
  );
};

export default EditProfile;
