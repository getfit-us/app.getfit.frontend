import { Save } from "@mui/icons-material";
import { Button, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";

const AccountDetails = ({ selectedClient }) => {
  const axiosPrivate = useAxiosPrivate();
  const updateClient = useProfile((state) => state.updateClient);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const onUpdate = async (data) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/users", data, {
        signal: controller.signal,
      });
      setStatus({ loading: false, error: null, success: true });
      updateClient(response.data);

      setTimeout(
        () => setStatus({ loading: false, error: null, success: null }),
        2000
      );
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  return (
    <Paper
      elevation={4}
      sx={{ p: 2, borderRadius: "15px" }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <h2>Account Details</h2>
      <p>
        {selectedClient?.firstname} {selectedClient?.lastname}
      </p>
      <p>Last Updated: {selectedClient?.accountDetails?.date}</p>
      <p>Last Login: {selectedClient?.lastLogin}</p>
      <TextField
        name="accountBalace"
        label="Current Account Balance"
        id="accountBalance"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        defaultValue={selectedClient?.accountDetails?.credit}
        sx={{ ml: 1, mr: 1, mt: 1, mb: 1 }}
      />
      <TextField
        name="sessionRate"
        label="Session Rate"
        id="sessionRate"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        defaultValue={selectedClient?.accountDetails?.rate}
        sx={{ ml: 1, mr: 1, mt: 1, mb: 1 }}
      />
      <Grid item xs={12} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          onClick={() => {
            const data = {};
            data.accountBalance =
              document.getElementById("accountBalance").value;
            data.sessionRate = document.getElementById("sessionRate").value;
            data._id = selectedClient;
            onUpdate(data);
          }}
          color={status.success ? "success" : "primary"}
          startIcon={<Save />}
        >
          {status.success ? "Saved Successfully" : "Save"}
        </Button>
      </Grid>
    </Paper>
  );
};

export default AccountDetails;
