import { Grid, List } from "@mui/material";

const About = () => {
  return (
    <Grid container style={styles.container}>
      <h1 className="page-title" style={{padding: 6, color: 'black'}}>GETFIT App</h1>

      <Grid item m={2}>
        <p>
          {" "}
          Created and designed to give my personal training clients a powerful
          tool to{" "}
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            GETFIT
          </span>{" "}
          and reach their goals!
        </p>
        
        <ul>    
            <li>Created using react JS</li>
            <li>Backend node express</li>
            <li>Mongodb for database entries</li>
            <li>Implements JSON web tokens for authentication</li>
            
            



        </ul>

        
      </Grid>
    </Grid>
  );
};

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "3rem",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
};

export default About;
