import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { colors } from "../../Store/colors";

const LoadingPage = () => {
  return (
    <div style={styles.container}>
      <h2>Getfit Loading..</h2>
      <img src="../../public/img/GF-logo-sm.png" alt="Getfit Logo" />
      <CircularProgress size={75} />
      
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: colors.lightgrey,
  },
};
export default LoadingPage;
