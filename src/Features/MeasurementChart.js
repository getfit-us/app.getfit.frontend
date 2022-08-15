import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useProfile from "../utils/useProfile";


const MeasurementChart = () => {
    const { state } = useProfile();


    return (
        <>
            <div>Measurement Chart</div>

            <ResponsiveContainer>
                <LineChart
                    data={state.measurements}
                    width={500}
                    height={300}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />


                </LineChart>


            </ResponsiveContainer>
        </>
    )
}

export default MeasurementChart