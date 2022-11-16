import { Link } from "react-router-dom";
const Missing = ({ error }) => {
  const styles = {
    NotFound: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column",
    },
    error: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#98a3a2",

      minHeight: "100vh",
    },
  };

  return (
    <>
      {!error && (
        <div style={styles.NotFound}>
          <h2>Uh-oh, this page does not exist!</h2>

          <Link to="/dashboard" replace>
            Go back
          </Link>

          {/* <img src={NotFound} alt='404 not found' height='60%' width='100%'/> */}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <h2>System Error</h2>
        </div>
      )}
    </>
  );
};

export default Missing;
