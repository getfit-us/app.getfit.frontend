import { Grid } from "@mui/material";


const About = () => {

    return (
        <Grid container style={styles.container}>
            
            <Grid item xs={12}>
            <h1 style={{textAlign: 'center'}}>GetFit App</h1>

            </Grid>
            <Grid item m={2}>
        <p className="paragraph"> Created and designed to give my personal training clients a powerful tool to <span style={{fontWeight: 'bold', fontSize:'1.5rem'}}>GETFIT</span> and reach their goals!</p>
            
            </Grid>


        </Grid>



    )
}



const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5px',
        minHeight: '100vh',
        display: 'flex',



    }




}

export default About;
