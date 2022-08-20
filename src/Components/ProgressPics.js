// component to display group of pictures ..
import React from 'react'
import useProfile from "../utils/useProfile";
import { Grid, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

const ProgressPics = () => {
    const { state } = useProfile();

    // going to show beginning photo with current alongside . 
    //Calendar to go back and view others 

    return (
        <>
            {
                state.measurements.map(measurement => {
                    if (measurement.images.length) {
                        return (
                            <ImageList sx={{ width: '50%', height: '50%' }}  
                            
                            gap={1}
                            cols={1.5}
                            > 
                                <ImageListItem xs={3} key={measurement.images}>


                                    <img src={`http://localhost:8000/progress/${measurement.images}`} alt=""
                                        srcSet={`${measurement.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        loading="lazy"

                                    />

                                    <ImageListItemBar
                                        title={measurement.date}
                                        // subtitle={<span>by: {item.author}</span>}
                                        position="below"
                                        align='center'
                                    />
                                </ImageListItem>

                            </ImageList>
                        )

                    }


                }

                )
            }

        </>


    )
}

export default ProgressPics