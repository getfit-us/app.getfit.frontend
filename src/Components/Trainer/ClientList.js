import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BASE_URL } from "../../assets/BASE_URL";
import { useProfile, useWorkouts } from "../../Store/Store";


const ClientList = ({selectedIndex, handleClientSelect}) => {
  const clients = useProfile((state) => state.clients);
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
    return (
    <div> <Paper elevation={5} sx={{ p: 2, borderRadius: "15px" }}>
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        border: "5px solid black",
      }}
      subheader={
        <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Clients
        </ListSubheader>
      }
    >
      <Divider />
      {clients?.map((client, index) => {
        return (
          <>
            <ListItem key={client._id} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => {
                  handleClientSelect(event, index, client._id);
                  setManageWorkout([]) // clear workout state
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={client.firstname[0]}
                    src={`${BASE_URL}/avatar/${client.avatar}`}
                    sx={{ bgcolor: "black" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  id={client._id}
                  primary={client.firstname + " " + client.lastname}
                />
              </ListItemButton>
            </ListItem>
          </>
        );
      })}
    </List>
  </Paper></div>
  )
}

export default ClientList