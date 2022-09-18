import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Missing from "./Missing";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const [validUrl, setValidUrl] = useState(true);
  const params = useParams();

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
        console.log(response.data);
        setValidUrl(true);
      } catch (e) {
        console.log(e);
        setValidUrl(false);
      }
    };

    confirmEmail();
  },[params]);

  return (
    <>
      {validUrl ? (
        <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
          <Grid item xs={12}>
            <h1>Email verified SuccessFully</h1>
          </Grid>
          <Button to="/login" variant="contained" color="success">
            Login
          </Button>
        </Grid>
      ) : (
        <Missing error={true} />
      )}
    </>
  );
};

export default VerifyEmail;
