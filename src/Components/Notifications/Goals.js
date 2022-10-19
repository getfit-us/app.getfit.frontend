import { Check, Delete } from "@mui/icons-material";
import {
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const Goals = () => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleCompleteGoal = async (id) => {
    console.log(id);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/users/calendar/${id}`, {
        signal: controller.signal,
        withCredentials: true,
      });
      
      dispatch({
        type: "DELETE_CALENDAR_EVENT",
        payload: id,
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  // set goals from calendar data
  let goals = [];
  if (state.calendar !== null) {
    goals = state.calendar.filter((item) => {
      if (item.type === "goal") {
        return true;
      }
    });
  }



  // need to do check for if today is the end date of goal. going to ask user to complete? 

  //also need to check if goal is this week

  //or if goal is within two days of completion date

  //also if goal is not this week or within two days of completion date ask user if they are on track ? 

  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
      }}
    >
      {" "}
      <form>
        <Grid
          container
          spacing={1}
          style={styles.container}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Grid item xs={12}>
            <h2 className="page-title">Goals</h2>
          </Grid>
          <Grid item xs={12}>
            <List>
              {goals &&
                goals.map((goal, index) => {
                  return (
                    <ListItem
                      key={goal._id}
                      disablePadding
                      secondaryAction={
                        <Tooltip title="Complete Goal">
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() => {
                              handleCompleteGoal(goal._id);
                            }}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemButton
                        role={undefined}
                        // selected={selectedIndex === index}
                        // onClick={() => handleListItemClick(index)}
                      >
                        <ListItemText
                          id={goal._id}
                          primary={<>
                          
                          
                          <h3 style={{textDecoration: 'underline'}}>GOAL</h3> 
                          
                          <span style={{ fontWeight: 'bolder'}}>{goal.title.toUpperCase()} {" "}</span><span>Start:  {" "}</span><span>{goal.start} {" "}</span><span>Finish: {goal.end}</span></>}
                          secondary={`Created: ${goal.created}`}
                          className="goal-message"
                          
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Grid>
          {goals?.length === 0 && (
            <Grid
              item
              xs={12}
              style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h2>No Goals Found</h2>
              <p>Click on the calendar to set a goal!</p>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "start",
    marginBottom: 3,
    spacing: 1,
    gap: 1,
    overflow: "hidden",
    // height: 400,
    // overflowY: "scroll",
    scrollBehavior: "smooth",
    width: "100%",
  },
  header: {
    padding: "10px",
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#3070af",
    color: "white",
  },
  message: {},
};

export default Goals;
