import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Missing from "./Missing";
import axios from "../hooks/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check } from "@mui/icons-material";

const VerifyEmail = () => {
  const [validUrl, setValidUrl] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // need to call axios backend to validate email address
    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `/verify/${params.id}/${params.token}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setValidUrl(true);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 5000);
      } catch (e) {
        console.log(e);
        setValidUrl(false);
      }
    };

    confirmEmail();
  }, [params]);

  return (
    <>
      {validUrl ? (
        <Grid container sx={{}} style={styles.container}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={styles.h1}>
              Success <Check fontSize="large" />
            </Typography>
            <h3 style={styles.h3}>Email Verified</h3>
            <h5>Head to the login page to get started!</h5>
            <Link to="/login">Login Page</Link>
          </Grid>
        </Grid>
      ) : (
        <Missing error={true} />
      )}
    </>
  );
};

export default VerifyEmail;

const styles = {
  h1: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 10,
    color: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    fontSize: 30,
  },
  h3: {},
  container: {
    backgroundColor: "#e6eaf0",
    minHeight: "100vh",
  },
};
