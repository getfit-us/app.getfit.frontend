import { Card, CardContent, CardHeader, Grid } from "@mui/material";



const HomePage = () => {

    return (

        

        
        <Grid container  style={styles.container} spacing={2}>
            <Grid item xs={12} sx={{textAlign: 'center'}}><h1> Get Fit Training App</h1>
            </Grid>
                    
            <Grid item xs={12} sm={4}>
                <Card>  
                    <CardHeader title='Track Your Progress'>
                     
                    </CardHeader>
                    <CardContent>

                       
                    </CardContent>

                </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
                <Card>  
                    <CardContent>

                        Provide custom workouts
                    </CardContent>

                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card> 
                    <CardHeader title="Set Goals"></CardHeader>
                    <CardContent>

                       
                    </CardContent>

                </Card>
            </Grid>


        </Grid>
    );
}

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
       
        minHeight: '100vh',
        
        

    }



}

export default HomePage;
