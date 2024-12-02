import { darken, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Rectangle, BarChart, Cell, Label } from 'recharts';

// const data = [
//     {
//         name: 'Page A',
//         uv: 4000,
//         pv: 2400,
//         amt: 2400,
//     },
//     {
//         name: 'Page B',
//         uv: 3000,
//         pv: 1398,
//         amt: 2210,
//     },
//     {
//         name: 'Page C',
//         uv: 2000,
//         pv: 9800,
//         amt: 2290,
//     },
//     {
//         name: 'Page D',
//         uv: 2780,
//         pv: 3908,
//         amt: 2000,
//     },
//     {
//         name: 'Page E',
//         uv: 1890,
//         pv: 4800,
//         amt: 2181,
//     },
//     {
//         name: 'Page F',
//         uv: 2390,
//         pv: 3800,
//         amt: 2500,
//     },
//     {
//         name: 'Page G',
//         uv: 3490,
//         pv: 4300,
//         amt: 2100,
//     },
// ];

const CustomLinechart = ({ chartData, chartNamesAndColors, xType, yType }) => {
    const [data, setData] = useState([]);
    const [namesAndColors, setNameAndColors] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        if (chartData)
            setData(chartData);
    }, [chartData])

    useEffect(() => {
        if (chartNamesAndColors)
            setNameAndColors(chartNamesAndColors);
    }, [chartNamesAndColors])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" padding={{ left: 30, right: 30 }}/>
                <YAxis type='number'>
                    <Label
                        value={yType == "TASK_COUNT" ? "Tasks" : "Time estimate"}
                        transform=''
                        angle={-90}
                        position="insideLeft"
                        dx={15}
                        dy={30}
                    />
                </YAxis>
                <Tooltip
                    contentStyle={{
                        backgroundColor: theme.palette.background.default,
                        borderColor: "transparent",
                        borderRadius: 8
                    }}
                />
                <Legend />
                <Line
                    name={yType == "TASK_COUNT" ? "Tasks" : "Time estimate"}
                    dataKey={`additionalFields.${xType}`}
                    stroke={yType == "TASK_COUNT" ? theme.palette.success.main : theme.palette.primary.main }
                    type="monotone"
                    activeDot={{ r: 8 }}
                />

            </LineChart>
        </ResponsiveContainer >
    )
}

export default CustomLinechart;