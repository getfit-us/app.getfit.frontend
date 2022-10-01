// component to display group of pictures ..
import useProfile from "../../hooks/useProfile";
import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, useRef } from "react";
import BASE_URL from "../assets/BASE_URL";




const ProgressPics = () => {
  const { state } = useProfile();
  const [MeasurementDate, setMeasurementDate] = useState(0);
  const FrontPic = useRef();

  document.title = "Progress Pictures";
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  // check if user uploaded any progress pictures
  const hasImages = state.measurements.map((measurement) => {
    if (measurement.images.length !== 0) return true;
    else return false;
  });
  //get current and oldestProgressPic
  let oldestProgressPic = state.measurements.findLast(
    (measurement) => measurement.images.length > 0
  );
  let latestProgressPic = state.measurements.find(
    (measurement) => measurement.images.length > 0
  );

  //set views
  let oldestFront = "";
  let oldestBack = "";
  let oldestSide = "";
  let latestFront = "";
  let latestBack = "";
  let latestSide = "";

  if (oldestProgressPic) {
    oldestProgressPic.images.map((image) => {
      if (image.includes("front")) oldestFront = image;
      if (image.includes("back")) oldestBack = image;
      if (image.includes("side")) oldestSide = image;
    });
  }
  if (latestProgressPic) {
    latestProgressPic.images.map((image) => {
      if (image.includes("front")) latestFront = image;
      if (image.includes("back")) latestBack = image;
      if (image.includes("side")) latestSide = image;
    });
  }
  // check if oldest and newest progress picture is the same
  if (
    hasImages.includes(true) &&
    oldestProgressPic._id === latestProgressPic._id
  )
    oldestProgressPic = {};

  const allProgressPics = state.measurements.map((measurement) => {
    let temp = [];

    //check if images exist
    if (measurement.images.length !== 0) {
      temp.push([measurement.date, measurement.images]);
      return temp.sort((a, b) => Date(a[0]) - Date(b[0]));
    }
    return false;
  });
  //allProgressPics is array of measurements first element contains date, second contains array of images

  return hasImages.includes(true) ? (
    <>
      <Grid container>
        <Grid item xs={12}>
          <h3 style={styles.h4}>Current & Oldest</h3>
        </Grid>
        <ImageList cols={mdUp ? 4 : 2} sx={{justifyContent: 'center'}}>
          {/* Loop through current measurement array with images  this need to be changed to check for front side back and display (old front and New front side by side) etc..*/}
          {Object.keys(latestProgressPic).length > 0 && latestFront && (
            <>
              <ImageListItem style={styles.imageListItem}>
                <img
                  src={`${BASE_URL}/progress/${latestFront}`}
                  alt=""
                  srcSet={`${latestFront}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={`Current: ${latestProgressPic?.date}`}
                  subtitle={<span>Front View</span>}
                  align="center"
                />
              </ImageListItem>
              {oldestFront && (
                <ImageListItem style={styles.imageListItem}>
                  <img
                    src={`${BASE_URL}/progress/${oldestFront}`}
                    alt=""
                    srcSet={`${oldestFront}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Oldest: ${oldestProgressPic?.date}`}
                    subtitle={<span>Front View</span>}
                    align="center"
                  />
                </ImageListItem>
              )}

              {latestSide && (
                <ImageListItem style={styles.imageListItem}>
                  <img
                    src={`${BASE_URL}/progress/${latestSide}`}
                    alt=""
                    srcSet={`${latestSide}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Current: ${latestProgressPic?.date}`}
                    subtitle={<span>Side View</span>}
                    align="center"
                  />
                </ImageListItem>
              )}

              {oldestSide && (
                <ImageListItem style={styles.imageListItem}>
                  <img
                    src={`${BASE_URL}/progress/${oldestSide}`}
                    alt=""
                    srcSet={`${oldestSide}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Oldest: ${oldestProgressPic?.date}`}
                    subtitle={<span>Side View</span>}
                    align="center"
                  />
                </ImageListItem>
              )}

              {/* Back view */}
              {latestBack && (
                <ImageListItem style={styles.imageListItem}>
                  <img
                    src={`${BASE_URL}/progress/${latestBack}`}
                    alt=""
                    srcSet={`${latestBack}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Current: ${latestProgressPic?.date}`}
                    subtitle={<span>Back View</span>}
                    align="center"
                  />
                </ImageListItem>
              )}
              {oldestBack && (
                <ImageListItem style={styles.imageListItem}>
                  <img
                    src={`${BASE_URL}/progress/${oldestBack}`}
                    alt=""
                    srcSet={`${oldestBack}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Oldest: ${oldestProgressPic?.date}`}
                    subtitle={<span>Back View</span>}
                    align="center"
                  />
                </ImageListItem>
              )}
            </>
          )}
        </ImageList>
        <Grid item xs={12}>
          {" "}
          <h2 style={styles.h4}>All Progress Pics</h2>
        </Grid>
        {/* Going to have select menu to view specific progress images*/}
        <Grid item xs={12} sx={{mt: 2}}>
          <Select
            defaultValue={0}
            fullWidth
            onChange={(event) => {
              setMeasurementDate(
                state.measurements.filter(
                  (measurement) => measurement.date === event.target.value
                )
              );
              setTimeout(
                () => FrontPic.current.scrollIntoView({ behavior: "smooth" }),
                100
              );
            }}
          >
            <MenuItem value={0}>Select a date</MenuItem>

            {state.measurements.map((measurement) => {
              if (measurement.images.length !== 0)
                return (
                  <MenuItem key={measurement._id} value={measurement.date}>
                    {measurement.date}
                  </MenuItem>
                );
            })}
          </Select>
        </Grid>

        <ImageList cols={smDN ? 1 : 2}>
          {MeasurementDate[0] &&
            MeasurementDate[0]?.images.map((image, index) => {
              return image.includes("front") ? (
                <>
                  <ImageListItem key={index + image}>
                    <img
                      src={`${BASE_URL}/progress/${image}`}
                      alt=""
                      srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      loading="lazy"
                      ref={FrontPic}
                    />
                    <ImageListItemBar
                      title={`Front`}
                      // subtitle={<span>by: {item.author}</span>}
                      align="center"
                    />
                  </ImageListItem>
                </>
              ) : image.includes("side") ? (
                <ImageListItem key={index + image}>
                  <img
                    src={`${BASE_URL}/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Side`}
                    // subtitle={<span>by: {item.author}</span>}
                    align="center"
                  />
                </ImageListItem>
              ) : (
                <ImageListItem autoFocus={true} key={index + image}>
                  <img
                    src={`${BASE_URL}/progress/${image}`}
                    alt=""
                    srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Back`}
                    // subtitle={<span>by: {item.author}</span>}
                    align="center"
                  />
                </ImageListItem>
              );
            })}
        </ImageList>


      {!MeasurementDate[0] && (
      <Grid item sx={{mb: 10 , mt:2,  }}>
      <Typography align="center">Select a date to view specific pictures</Typography>
      </Grid>
      )}
      </Grid>
    </>
  ) : (
    <Grid container>
      <Grid item xs={12} style={styles.h3}>
        <h1>Nothing Found</h1>
      </Grid>
      <Grid item xs={12} style={styles.h3}>
        <h3>Goto the measurements page and add progress pictures!</h3>
      </Grid>
    </Grid>
  );
};

const styles = {
  h3: {
    textAlign: "center",
    margin: "1px",
    padding: "4px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
  
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    marginTop: "5rem",
  },
  h4: {
    textAlign: "center",
    margin: "1px",
    padding: "8px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    marginTop: "5rem",
    color: "#fff",
  },
  img: {
    border: "5px solid #555",
  },
  imageListItem: {
    padding: "1rem",
    border: "5px solid black",
  },
};

export default ProgressPics;
