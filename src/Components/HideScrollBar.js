import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';



const HideScrollBar = ({ children }) => {

    const trigger = useScrollTrigger({

        disableHysteresis: true,
        threshold: 100,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
          {children}
        </Slide>
      );
    }

export default HideScrollBar