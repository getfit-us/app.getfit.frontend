// component to display group of pictures ..
import useProfile from "../utils/useProfile";
import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useMediaQuery,
} from "@mui/material";

const ProgressPics = () => {
  const { state } = useProfile();

  // going to show beginning photo with current alongside .
  //Calendar to go back and view others
  // console.log(state.measurements)

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });
  // check if user uploaded any progress pictures
  const hasImages = state.measurements.map((measurement) => {
    
    if (measurement.images.length !== 0) return true;
    else return false;
  });
  //check oldest measurement log for images
  const oldestProgressPic = state.measurements[state.measurements.length - 1]?.images.length > 0

  const allProgressPics = state.measurements.map(measurement => {
        let temp = []

        //check if images exist
        if (measurement.images.length === 1  ) { 
            temp.push([measurement.date, measurement.images])


        } else if (measurement.images.length > 1) {
            for (let i=0; i < measurement.images.length; i++) {
                temp.push([measurement.date, measurement.images[i]])
            }
        }
        return temp.sort((a,b) => Date(a[0]) - Date(b[0]))

  })
return (
  hasImages.includes(true) ?  (
    
    <>
      <h3 style={styles.h4}>Current & Oldest</h3>

      <ImageList cols={mdUp ? 4 : 2} rowHeight="auto">
        {/* if measurement has more then one image in array */}
        {hasImages.includes(true) && state.measurements[0]?.images?.length > 1 && (
          <>
            <ImageListItem>
              <img
                src={`http://localhost:8000/progress/${state.measurements[0]?.images[0]}`}
                alt=""
                srcSet={`${state.measurements[0]?.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
              />

              <ImageListItemBar
                title={`Latest: ${state.measurements[0]?.date}`}
                // subtitle={<span>by: {item.author}</span>}

                align="center"
              />
            </ImageListItem>
            <ImageListItem>
              <img
                src={`http://localhost:8000/progress/${
                  state.measurements[state.measurements.length - 1]?.images[0]
                }`}
                alt=""
                srcSet={`${
                  state.measurements[state.measurements.length - 1]?.images[0]
                }?w=248&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
              />

              <ImageListItemBar
                title={`Oldest: ${oldestProgressPic ? 
                  state.measurements[state.measurements.length - 1]?.date : 'has no Picture'
                }`}
                // subtitle={<span>by: {item.author}</span>}

                align="center"
              />
            </ImageListItem>
          </>
        )}

        {state.measurements[0].images.length > 1 && (
          <ImageListItem>
            <img
              src={`http://localhost:8000/progress/${
                state.measurements[state.measurements.length - 1]?.images[0]
              }`}
              alt=""
              srcSet={`${
                state.measurements[state.measurements.length - 1]?.images[0]
              }?w=248&fit=crop&auto=format&dpr=2 2x`}
              loading="lazy"
            />

            {state.measurements[0].images.length === 1 && (
              <ImageListItemBar
                title={`Oldest: ${
                  state.measurements[state.measurements.length - 1]?.date
                }`}
                // subtitle={<span>by: {item.author}</span>}

                align="center"
              />
            )}
          </ImageListItem>
        )}
      </ImageList>

      <h2 style={styles.h4}>All Progress Pics</h2>
      <ImageList cols={mdUp ? 4 : 2}>
        {state.measurements.map((measurement) => {
          if (measurement.images.length === 1) {
            console.log("first if");
            return (
              <ImageListItem key={measurement.date}>
                <img
                  src={`http://localhost:8000/progress/${measurement?.images}`}
                  alt=""
                  srcSet={`${measurement?.images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  loading="lazy"
                  style={styles.img}
                />

                <ImageListItemBar
                  title={measurement?.date}
                  // subtitle={<span>by: {item.author}</span>}

                  align="center"
                />
              </ImageListItem>
            );
          } else if (measurement.images.length > 1) {
            measurement.images.map((image) => {
              return (
                <ImageListItem key={measurement.date}>
                  <img
                    src={`http://localhost:8000/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />

                  <ImageListItemBar
                    title={measurement?.date}
                    // subtitle={<span>by: {item.author}</span>}

                    align="center"
                  />
                </ImageListItem>
              );
            });
          }
        })}
      </ImageList>
    </>
  ) : (
    <Grid container>
      <Grid item xs={12} style={styles.h3}>
        <h1>Nothing Found</h1>
      </Grid>
      <Grid item xs={12} style={styles.h3}>
        <h3>Goto the measurements page and add some pictures</h3>
      </Grid>
    </Grid>
  ))
}

const styles = {
  h3: {
    textAlign: "center",
    margin: "1px",
    padding: "10px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    border: "5px solid black",
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
    marginTop: '5rem'
  },
  h4: {
    textAlign: "center",
    margin: "1px",
    padding: "8px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    border: "5px solid black",
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
    marginTop: '5rem'
  },
  img: {

    border: '5px solid #555'
  }
};

export default ProgressPics;
