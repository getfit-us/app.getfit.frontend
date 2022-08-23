import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { border, borderRadius } from "@mui/system";



const HomePage = () => {

    return (




        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }} ><h1> GETFIT Personal Training </h1>
            </Grid>

            <Grid item style={styles.h1}>
                <Typography variant='h1' textAlign='center'>All In one personal training client management app. </Typography>


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
    h1: {
        padding: 0,
        margin:0,
        marginBottom: 2,
        overflow: false,

        backgroundColor: '#6fe896',
        height: '500px',
        width: 'auto',
        borderRadius: '50%',
        alignSelf: 'center'
}
}



export default HomePage;
