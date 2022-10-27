import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material";
import useProfile from "../../hooks/useProfile";
import { BASE_URL } from "../../assets/BASE_URL";


const ClientList = ({selectedIndex, handleClientSelect}) => {
 const {state, dispatch} = useProfile();

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
      {state.clients.map((client, index) => {
        return (
          <>
            <ListItem key={client._id} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => {
                  handleClientSelect(event, index, client._id);
                  dispatch({ type: "MANAGE_WORKOUT", payload: [] }); // clear workout state
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