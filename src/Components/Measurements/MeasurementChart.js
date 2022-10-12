import useProfile from "../../hooks/useProfile"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, Text } from 'recharts';
import { useMediaQuery } from '@mui/material';


// want to add clickable measurements to view modal

const MeasurementChart = ({ width, barSize, measurements}) => {
    const { state } = useProfile();
    let sorted = []
   measurements?.length > 0 ?  sorted = measurements.sort((a,b) => new Date(b.date) - new Date(a.date)) : sorted = state.measurements.sort((a,b) => new Date(b.date) - new Date(a.date))
    const smScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
        defaultMatches: true,
        noSsr: false,
      });
  


    return (




        <BarChart
            width={width}
            height={300}
            data={sorted}
            margin={{
                top: 1,
                bottom: 1,
                left: 1,
                right: 15
            }}
           barSize={12}
           barGap={.5}
            
            style={styles.chart}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey='date' onClick={(e) => console.log(e.name)} />
            <YAxis />
            <Tooltip contentStyle={{opacity: 0.9}} />
            <Legend  />

            <Bar dataKey="bodyfat" fill="#800923"  />
            <Bar dataKey="weight" fill="#3070af"  onClick={(e) => console.log(e.target)} />
        </BarChart>






    )
}

const styles = {
    chart:
    {
        fontSize: ".9rem",
        fontWeight: 'bold',
        backgroundColor: '',
        backgroundImage: '',
        boxShadow: '2px #00e9a6',
  
        padding:'5px',
    
        justifyContent:'center', display: 'flex',
        
        margin: 2,
       
    }
}

export default MeasurementChart