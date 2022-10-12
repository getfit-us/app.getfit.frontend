import { Button, Divider, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import useProfile from "../../hooks/useProfile";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { Add, Delete } from "@mui/icons-material";

const Tasks = () => {
  const { state, dispatch } = useProfile();
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  //get tasks
  const tasks = state.notifications.filter(
    (notification) => notification.type === "task"
  );
 
 const addTask = (
    <>
    <Paper>
        <Grid container>
        <Grid item xs={12}>
            <TextField fullWidth name='newTask' label="New Task"/>
            </Grid>
        </Grid>

    </Paper>
    </>
 )

  console.log(tasks);

  

 
   return  (
      <div className="container">
        {tasks?.length > 0 ? (
      <Paper sx={{mt: '2rem', borderRadius: 5, }}>
        <List>
        <ListItemText primary="Tasks" primaryTypographyProps={{fontSize: '2rem'}} sx={{textAlign: 'center', }}/>
        <Divider/>
          {tasks.map((task) => {
            return (
              <ListItem
                key={tasks._id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <Delete />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(task._id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(task._id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": task._id }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={task._id}
                    primary={task.message}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
     
   ): (
    <div className="container">
      <Paper sx={{mt: '5rem', borderRadius: 5, p:2 }}>
        <Grid item xs={12}>
          <h2 className="page-title"> No Tasks Found</h2>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth name='newTask' label="New Task" style={{marginTop: '1rem', marginBottom: '1rem',}}/>
          <Button startIcon={<Add/>} variant="contained" onClick={() => {}} >Add New Task</Button>
        </Grid>
      </Paper></div>
      
    )}
     </div>
    )
};

export default Tasks;
