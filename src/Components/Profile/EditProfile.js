import {
  Button,
  
  Grid,
  
  Paper,
  TextField,
 
} from "@mui/material";
import { useState } from "react";
import Password from "../../Pages/Password";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { useProfile } from "../../Store/Store";


const EditProfile = () => {
  const profile = useProfile((state) => state.profile);
  const updateProfileState = useProfile((state) => state.updateProfile);
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
    data.id = profile.clientId;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(`/users/${data.id}`, data, {
        signal: controller.signal,
        withCredentials: true,
      });
      updateProfileState(response.data);
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

  //if new goals are added to state then we need to add notifications to the backend and to notifications

  return (
    <>
      <Paper elevation={2} style={styles.paper}>
        <Grid
          item
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            mt : '1rem',
            mb: '1rem',
          }}
        >
         <h2>
            Edit Profile
          </h2>
        </Grid>
        <form>
          <Grid container spacing={1} gap={1} sx={{ p: 1,  }}>
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
                defaultValue={profile.firstName}
                label="First Name"
                type="text"
                size="small"
                fullWidth
                error={errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                sx={{ m: 1, pr: 1 }}
              />

              <TextField
                defaultValue={profile.lastName}
                label="Last Name"
                type="text"
                size="small"

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
                defaultValue={profile.email}
                label="Email"
                type="text"
                fullWidth
                size="small"

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
                defaultValue={profile.phone}
                label="Phone"
                type="text"
                fullWidth
                size="small"

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
                defaultValue={profile.age}
                label="Age"
                type="text"
                size="small"

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
              <div style={{display: 'flex', justifyContent: 'center'}}>  <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit(updateProfile)}
                color={success ? "success" : "primary"}
                sx={{just: "center"}}
              >
                {success ? "Successfully Updated" : "Save Changes"}
              </Button></div>
             
            </Grid>
          
            <Grid item xs={12} sm={5}>
              {" "}
              <Password />
            </Grid>
          </Grid>
        </form>
      </Paper>
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
