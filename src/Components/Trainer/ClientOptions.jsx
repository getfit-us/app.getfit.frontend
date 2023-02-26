import { AddTask, FitnessCenter, Flag, History, Paid, Straighten } from "@mui/icons-material"
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material"

const ClientOptions = ({handleOptionsList, selectedOption}) => {




  return (
    <div><Paper sx={{ p: 2, borderRadius: "15px" }}>
              <List
                dense
                sx={{
                 
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  border: "5px solid black",
                }}
                subheader={
                  <ListSubheader
                    sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                  >
                    Options
                  </ListSubheader>
                }
              >
                <Divider />

                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 0}
                    onClick={(event) => handleOptionsList(event, 0)}
                  >
                    {" "}
                    <ListItemIcon>
                      <Straighten />
                    </ListItemIcon>
                    <ListItemText primary={"Measurements"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 1}
                    onClick={(event) => handleOptionsList(event, 1)}
                  >
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>

                    <ListItemText primary={"Start Workout"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 2}
                    onClick={(event) => handleOptionsList(event, 2)}
                  >
                    <ListItemIcon>
                      <Paid />
                    </ListItemIcon>

                    <ListItemText primary={"Account Details"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 3}
                    onClick={(event) => handleOptionsList(event, 3)}
                  >
                    <ListItemIcon>
                      <History />
                    </ListItemIcon>

                    <ListItemText primary={"View Workouts"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 4}
                    onClick={(event) => handleOptionsList(event, 4)}
                  >
                    <ListItemIcon>
                      <Flag />
                    </ListItemIcon>

                    <ListItemText primary={"View Goals"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedOption === 5}
                    onClick={(event) => handleOptionsList(event, 5)}
                  >
                    <ListItemIcon>
                      <AddTask />
                    </ListItemIcon>

                    <ListItemText primary={"Add Task"} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper></div>
  )
}

export default ClientOptions