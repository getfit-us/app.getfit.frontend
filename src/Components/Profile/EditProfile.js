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
    unregister,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const updateProfile = async (data) => {
    let isMounted = true;
    setLoading(true);
    //set clientId
    data.id = state.profile.clientId;
    data.goals = [];

    //find goals objects and add to array
    const pattern = /goal+[0-9]/;
    let num = null;

    for (const [key, value] of Object.entries(data)) {
      if (pattern.test(key) && !key.includes("date")) {
        num = key.charAt(key.length - 1);
        data.goals.push({ goal: value, date: "" });
      }
      if (pattern.test(key) && key.includes(`date`)) {
      data.goals[num].date = value;
      }
    }
   

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(`/users/${data.id}`, data, {
        signal: controller.signal,
        withCredentials: true,
      });
      console.log(response.data)
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

 

  // no goals in state then add one for to begin with
  if (state.profile.goals?.length === 0) {
    const newGoals = [...state.profile.goals];
    newGoals.push([{ goal: "", date: "" }]);
    dispatch({
      type: "UPDATE_GOALS",
      payload: newGoals,
    });
  }

  //if new goals are added to state then we need to add notifications to the backend and to state.notifications
 

  console.log(state.profile.goals);

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

            <Grid container xs={12} sm={5} sx={{ p: 1 }}>
              <Grid item xs={12}>
                <h4 style={styles.h5}>Goals</h4>
              </Grid>

              {state.profile.goals.map((goal, idx) => (
                <Grid item xs={12} >
                  <Paper elevation={6} sx={{p:2 , borderRadius: 5, mt:1 , mb:1}}>
                  <TextField
                    sx={{ mb: 1 }}
                    key={goal}
                    defaultValue={goal.goal}
                    label={idx >= 1 ? `Goal #${idx + 1}` : `Goal #1`}
                    type="text"
                    minRows={1}
                    multiline
                    fullWidth
                    {...register(`goal${idx}`)}
                  />
                  <TextField
                    type="date"
                    name={`goal${idx}date`}
                    defaultValue={goal.date}
                    {...register(`goal${idx}date`, {
                      required:
                        "Please select the date of your projected goal achievement.",
                      pattern: {
                        value:
                          /^{|2[0-9]{3}-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
                        message: "Please select a valid date",
                      },
                    })}
                    label={idx >= 1 ? `Achievement Date` : `Achievement Date`}
                    InputLabelProps={{ shrink: true, required: true }}
                    error={errors.date}
                    helperText={errors.date ? errors.date.message : " "}
                  />
                  <Tooltip
                    title="Add"
                    sx={{ justifyContent: "center", alignContent: "center" }}
                  >
                    <IconButton
                      onClick={() => {
                        const newGoals = [...state.profile.goals];
                        newGoals.push([{ goal: "", date: "" }]);
                        dispatch({
                          type: "UPDATE_GOALS",
                          payload: newGoals,
                        });
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                  {idx >= 1 && (
                    <Tooltip
                      title="Remove"
                      sx={{ justifyContent: "center", alignContent: "center" }}
                    >
                      <IconButton
                        onClick={() => {
                          const newGoals = state.profile.goals.filter((g) => {
                            return g !== state.profile.goals[idx];
                          });
                          dispatch({
                            type: "UPDATE_GOALS",
                            payload: newGoals,
                          });
                          //remove inputs from form hook
                          unregister(`goal${idx}`);
                          unregister(`goal${idx}date`);
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Tooltip>
                  )}
                   </Paper>
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
      <Grid
        container
        xs={12}
        sm={6}
        md={4}
        sx={{ display: "flex", justifyContent: "start", mt: 3 }}
      >
        {" "}
        <Password />
      </Grid>
    </>
  );
};
const styles = {
  h5: {
    padding: 5,
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

export default EditProfile;
