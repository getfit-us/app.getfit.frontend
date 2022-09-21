// component to display group of pictures ..
import useProfile from "../../hooks/useProfile";
import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useMediaQuery,
} from "@mui/material";

const ProgressPics = () => {
  const { state } = useProfile();

  document.title = "Progress Pictures";
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  // check if user uploaded any progress pictures
  const hasImages = state.measurements.map((measurement) => {
    if (measurement.images.length !== 0) return true;
    else return false;
  });

 //set views


  //get current and oldestProgressPic
  let oldestProgressPic = state.measurements.findLast(
    (measurement) => measurement.images.length > 0
  );
  let latestProgressPic = state.measurements.find(
    (measurement) => measurement.images.length > 0
  );

// check if oldest and newest progress picture is the same
if (hasImages.includes(true) && oldestProgressPic._id === latestProgressPic._id) oldestProgressPic = {}

  

  const allProgressPics = state.measurements.map((measurement) => {
    let temp = [];

    //check if images exist
    if (measurement.images.length !== 0) {
      temp.push([measurement.date, measurement.images]);
      return temp.sort((a, b) => Date(a[0]) - Date(b[0]));
    } 
    return false
   
  });
  //allProgressPics is array of measurements first element contains date, second contains array of images

  console.log(latestProgressPic,oldestProgressPic, allProgressPics);
  return hasImages.includes(true) ? (
    <>  
    <Grid container>
      <Grid item xs={12}>
      <h3 style={styles.h4}>Current & Oldest</h3>
    </Grid>
      <ImageList cols={mdUp ? 4 : 2} >
        {/* Loop through current measurement array with images  this need to be changed to check for front side back and display (old front and New front side by side) etc..*/}
        {Object.keys(latestProgressPic).length > 0 && latestProgressPic.images.map((image, index) => {
          return (
            <ImageListItem
              cols={2}
              rowHeight="auto"
              style={styles.imageListItem}
              key={index + 1}
            >
              <img
                src={`http://localhost:8000/progress/${image}`}
                alt=""
                srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
                maxWidth="250"
              />
              <ImageListItemBar
                title={`Latest: ${latestProgressPic?.date}`}
                // subtitle={<span>by: {item.author}</span>}

                align="center"
              />
            </ImageListItem>
          );
        })}
        <>
        {Object.keys(oldestProgressPic).length > 0 && oldestProgressPic.images.map((image, index) => {
          return (
            <ImageListItem
              cols={2}
             
              style={styles.imageListItem}
              key={index + 1}
            >
              <img
                src={`http://localhost:8000/progress/${image}`}
                alt=""
                srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
              />
              <ImageListItemBar
                title={`Latest: ${oldestProgressPic?.date}`}
                // subtitle={<span>by: {item.author}</span>}

                align="center"
              />
            </ImageListItem>
          );
        })}

        
        </>
        
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
        <Grid item xs={12}>  <h2 style={styles.h4}>All Progress Pics</h2></Grid>
    
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
      </Grid>
    </>
  ) : (
    <Grid container>
      <Grid item xs={12} style={styles.h3}>
        <h1>Nothing Found</h1>
      </Grid>
      <Grid item xs={12} style={styles.h3}>
        <h3>Goto the measurements page and starting pictures!</h3>
      </Grid>
    </Grid>
  );
};

const styles = {
  h3: {
    textAlign: "center",
    margin: "1px",
    padding: "10px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    border: "5px solid black",
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
    border: "5px solid black",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    marginTop: "5rem",
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
