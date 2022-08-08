import { Grid } from "@mui/material";


const About = () => {

    return (
        <Grid container style={styles.container}>
            
            <Grid item>
            <h2 className='text-center'>About</h2>

            </Grid>
            <Grid item m={2} p={2}>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde consectetur adipisci officiis! Totam, suscipit? A quae nemo, repellat sequi quibusdam vel iure eligendi exercitationem animi itaque, assumenda dolores autem. Nemo suscipit voluptatum optio minima repudiandae iste aliquid. Laborum, ipsa! Velit earum iure iste maxime? Voluptate quod quas tempora repellendus, quam explicabo repudiandae enim! Sunt architecto nostrum sed culpa possimus quos quidem porro debitis error dolorem sint expedita necessitatibus doloribus quis pariatur sit, dolorum perspiciatis suscipit fugit repellendus? Nostrum ratione architecto vero cumque atque hic iure incidunt iste, mollitia dolore unde, provident non nemo porro totam aliquid quaerat! Minus, molestiae natus?
            </Grid>


        </Grid>



    )
}



const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5px',
        minHeight: '100vh'

    }



}

export default About;
