import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Profile from "../../Pages/Profile";
import Notifications from "../Notifications";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import EditProfile from "./EditProfile";

function TabPanel({ children, value, index, ...other }) {
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TabView = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "3rem" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Profile Tabs"
          sx={{
            "& .MuiTabs-flexContainer": {
              flexWrap: "wrap",
            },
          }}
          TabIndicatorProps={{ sx: { display: 'none' } }}

        >
          <Tab
            icon={<AccountBoxIcon />}
            iconPosition="start"
            label="General"
            {...a11yProps(0)}
          />
          <Tab
            icon={<NotificationsIcon />}
            iconPosition="start"
            label="Notifications"
            {...a11yProps(1)}
          />
          <Tab
            icon={<EditIcon />}
            iconPosition="start"
            label="Edit Profile"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Profile />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Notifications />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EditProfile />
      </TabPanel>
    </Box>
  );
};

export default TabView;
