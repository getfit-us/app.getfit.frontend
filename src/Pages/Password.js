import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { red } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert } from "@mui/material";
import { useProfile } from "../Store/Store";
import { ResetTv } from "@mui/icons-material";

const Password = () => {
  const axiosPrivate = useAxiosPrivate();
  const profile = useProfile((state) => state.profile);
  const [update, setUpdate] = useState(false);
  const [invalidPass, setInvalidPass] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const onSubmit = async (data) => {
    let isMounted = true;

    console.log(data);

    const controller = new AbortController();
    data.id = profile.clientId;
    data.email = profile.email;
    data.accessToken = profile.accessToken;

    try {
      const response = await axiosPrivate.put("/updatepassword", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
   

      setUpdate(true);
      setInvalidPass(false);
      setTimeout(() => {}, "1000");
      reset();
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) setInvalidPass(true);
      setTimeout(() => setInvalidPass(false), "5000");
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Grid item xs={12}>
        <h4 style={styles.title}>
          {invalidPass ? (
            <Alert severity="error">Incorrect Password</Alert>
          ) : (
            "Change Password"
          )}
        </h4>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        {" "}
        <Avatar variant="circle" sx={{ m: 1, bgcolor: red[500] }}>
          <LockOutlinedIcon />
        </Avatar>
      </Grid>
      <form sx={{ mt: 1 }} noValidate autoComplete="off">
        <Grid container sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <TextField
              {...register("oldpassword", { required: true })}
              required
              fullWidth
              size="small"
              name="oldpassword"
              label="Old password"
              error={errors.oldpassword}
              id="oldpassword"
              type="password"
              control={control}
              sx={{ m: 1 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <TextField
              {...register("password", {
                required:
                  "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                },
              })}
              margin="normal"
              required
              fullWidth
              size="small"
              name="password"
              label="New password"
              error={errors.password}
              id="password"
              type="password"
              control={control}
              sx={{ m: 1 }}
              helperText={errors.password ? errors.password.message : ""}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <TextField
              extField
              {...register("password2", {
                required:
                  "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, ne or more numeric values, one or more special characters",
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long, The password must contain one or more uppercase characters, one or more lowercase characters, one or more numeric values",
                },
              })}
              margin="normal"
              required
              size="small"
              name="password2"
              label="Confirm password"
              type="password"
              id="password2"
              fullWidth
              error={errors.password2}
              sx={{ m: 1 }}
              helperText={errors.password2 ? errors.password2.message : ""}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color={update ? "success" : "primary"}
              sx={{ mt: 3, mb: 1 }}
              onClick={handleSubmit(onSubmit)}
            >
              {update ? "Success" : "Update"}
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Link to="/forgot-password">Forgot password</Link>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

const styles = {
  title: {
    padding: 5,
    backgroundColor: "#29282b",
    color: "white",
    borderRadius: "20px",
    textAlign: "center",
  },
  paper: {
    borderRadius: "10px",
    boxShadow: 3,
  },
};

export default Password;
