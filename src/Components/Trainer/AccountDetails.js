import { Save } from "@mui/icons-material";
import { Button, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const AccountDetails = ({selectedIndex, selectedClient, setShow}) => {
    const { state, dispatch } = useProfile();
    const axiosPrivate = useAxiosPrivate();

    const onUpdate = async (data) => {
        const controller = new AbortController();
        try {
          const response = await axiosPrivate.put("/users", data, {
            signal: controller.signal,
          });
          console.log(response);
          setShow((prev) => {
            let _show = { ...prev };
            _show.account = false;
            return _show;
          });
          dispatch({ type: "UPDATE_CLIENT", payload: response.data });
        } catch (err) {
          console.log(err);
        }
        return () => {
          controller.abort();
        };
      };

  return (
    <div>
      <Paper elevation={4} sx={{ p: 2, borderRadius: "15px" }}>
        <h2>Account Details</h2>
        <p>
          {state?.clients[selectedIndex]?.firstname}{" "}
          {state?.clients[selectedIndex]?.lastname}
        </p>
        <p>
          Last Updated: {state?.clients[selectedIndex]?.accountDetails?.date}
        </p>
        <p>Last Login: {state?.clients[selectedIndex]?.lastLogin}</p>
        <TextField
          name="accountBalace"
          label="Current Account Balance"
          id="accountBalance"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          defaultValue={state?.clients[selectedIndex]?.accountDetails?.credit}
          sx={{ ml: 1, mr: 1, mt: 1, mb: 1 }}
        />
        <TextField
          name="sessionRate"
          label="Session Rate"
          id="sessionRate"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          defaultValue={state?.clients[selectedIndex]?.accountDetails?.rate}
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
            color="success"
            startIcon={<Save />}
          >
            Save
          </Button>
        </Grid>
      </Paper>
    </div>
  );
};

export default AccountDetails;
