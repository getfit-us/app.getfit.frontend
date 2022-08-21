// component to display group of pictures ..
import useProfile from "../utils/useProfile";
import { Grid, ImageList, ImageListItem, ImageListItemBar, ListSubheader, Typography , useMediaQuery} from '@mui/material';

const ProgressPics = () => {
    const { state } = useProfile();

    // going to show beginning photo with current alongside . 
    //Calendar to go back and view others 
    // console.log(state.measurements)

    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'), {
        defaultMatches: true,
        noSsr: false
      });
    return (
        <>
            <ImageList cols={mdUp ? 4 : 2}
            >




                {
                    state.measurements.map(measurement => {
                        if (measurement.images.length) {
                            return (

                                <ImageListItem key={measurement.date}>


                                    <img src={`http://localhost:8000/progress/${measurement.images}`} alt=""
                                        srcSet={`${measurement.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        loading="lazy"

                                    />

                                    <ImageListItemBar
                                        title={measurement.date}
                                        // subtitle={<span>by: {item.author}</span>}

                                        align='center'
                                    />
                                </ImageListItem>


                            )

                        }




                    }

                    )
                }
            </ImageList>

        </>




    )
}

export default ProgressPics