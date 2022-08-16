import { useState } from 'react'
import useProfile from "../utils/useProfile";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, Text } from 'recharts';




const MeasurementChart = ({ width }) => {
    const { state } = useProfile();
    





    return (




        <BarChart
            width={width}
            height={300}
            data={state.measurements}
            margin={{
                top: 1,
                bottom: 1,
                left: 1,
                right: 15
            }}
            barSize={30}
            barGap={1}
            barCategoryGap={1}

            style={styles.chart}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="bodyfat" fill="#DB504A" />
            <Bar dataKey="weight" fill="#084C61" />
        </BarChart>






    )
}

const styles = {
    chart:
    {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#E4E7E7',
        alignSelf: 'center',
        margin: 2,
    }
}

export default MeasurementChart