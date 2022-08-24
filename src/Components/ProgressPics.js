// component to display group of pictures ..
import useProfile from "../utils/useProfile";
import { ImageList, ImageListItem, ImageListItemBar, useMediaQuery } from '@mui/material';

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
            <h2 style={{ textAlign: 'center' , marginTop: 40}}>Current & Oldest</h2>

            <ImageList cols={mdUp ? 4 : 2}
                rowHeight="auto"

            >

                <ImageListItem >


                    <img src={`http://localhost:8000/progress/${state.measurements[0]?.images}`} alt=""
                        srcSet={`${state.measurements[0]?.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        loading="lazy"

                    />

                    <ImageListItemBar
                        title={`Latest: ${state.measurements[0]?.date}`}
                        // subtitle={<span>by: {item.author}</span>}

                        align='center'
                    />

                    {state.measurements[0]?.images && <p>Nothing Found</p> }
                </ImageListItem>
                <ImageListItem >


                    <img src={`http://localhost:8000/progress/${state.measurements[state.measurements.length - 1]?.images}`} alt=""
                        srcSet={`${state.measurements[state.measurements.length - 1]?.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        loading="lazy"

                    />

                    <ImageListItemBar
                        title={`Oldest: ${state.measurements[state.measurements.length - 1]?.date}`}
                        // subtitle={<span>by: {item.author}</span>}

                        align='center'
                    />
                </ImageListItem>

            </ImageList>





            <h2 style={{ textAlign: 'center' }}>All Progress Pics</h2>
            <ImageList cols={mdUp ? 6 : 2}

            >





                {
                    state.measurements.map(measurement => {
                        if (measurement.images.length) {
                            return (

                                <ImageListItem key={measurement.date}>


                                    <img src={`http://localhost:8000/progress/${measurement?.images}`} alt=""
                                        srcSet={`${measurement?.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        loading="lazy"

                                    />

                                    <ImageListItemBar
                                        title={measurement?.date}
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