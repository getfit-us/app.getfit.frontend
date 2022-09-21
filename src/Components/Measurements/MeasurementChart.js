import { useState, useMemo } from 'react'
import useProfile from "../../hooks/useProfile"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, Text } from 'recharts';
import { useMediaQuery } from '@mui/material';




const MeasurementChart = ({ width, barSize}) => {
    const { state } = useProfile();
    
    const sorted = useMemo(() => state.measurements.sort((a,b) => new Date(b.date) - new Date(a.date)),[state.measurements])
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
            barSize={barSize}
            barGap={1}
            barCategoryGap={1}
            onClick={(e) => console.log(e.target)}
            style={styles.chart}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip contentStyle={{opacity: 0.9}}/>
            <Legend  />

            <Bar dataKey="bodyfat" fill="#34aad1" />
            <Bar dataKey="weight" fill="#225ed6" />
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
  

    
        alignSelf: 'center',
        margin: 2,
    }
}

export default MeasurementChart