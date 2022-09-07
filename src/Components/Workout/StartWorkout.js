import { useEffect, useMemo, useState } from "react";
import useProfile from "../../utils/useProfile";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import { FormControlLabel, FormGroup, Grid, Switch, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from 'prop-types';
import SearchCustomWorkout from "./SearchCustomWorkout";


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  


const StartWorkout = () => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [tabValue, setTabValue] = useState(0);
  const [showStartWorkout, setShowStartWorkout] = useState([]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    //grab customWorkouts assigned to user/ client
    const getCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
    //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(`/custom-workout/client/${state.profile.clientId}`, {
          signal: controller.signal,
        });
        console.log(response.data);
        dispatch({ type: "SET_CUSTOM_WORKOUTS", payload: response.data });
        // reset();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          isMounted = false;

          controller.abort();
        };
      }
    };

    if (state.customWorkouts.length === 0) {
        console.count('inside if')
        getCustomWorkouts();}



  }, [state.customWorkouts]);



  
  console.log(showStartWorkout);
  
  return (

    <>

    {showStartWorkout?.length > 0 ?
      
      <div>test</div> : 
   
     <Grid container justifyContent='center' sx={{mt: 6}}>
        <Grid item  xs={12} sx={{textAlign: 'center'}}><h4 style={{textAlign: 'center'}}>Start Session</h4></Grid>

        <Grid item> <FormGroup>
      <FormControlLabel control={<Switch defaultChecked />} label="Start Workout now?" />
     
    </FormGroup></Grid>
   
     <Box sx={{ width: '100%' }}>
     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
       <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
         <Tab label="Assigned" {...a11yProps(0)} />
         <Tab label="Created" {...a11yProps(1)} />
         
       </Tabs>
     </Box>
     <TabPanel value={tabValue} index={0}>
      <SearchCustomWorkout setShowStartWorkout={setShowStartWorkout}  showStartWorkout={showStartWorkout} />
     </TabPanel>
     <TabPanel value={tabValue} index={1}>
       Item Two
     </TabPanel>
     
   </Box>
   </Grid>}
   </>
   
    
    );
};

export default StartWorkout;
