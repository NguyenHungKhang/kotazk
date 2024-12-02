import { darken, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Rectangle, BarChart, Cell, Label } from 'recharts';


const CustomStackedBar = ({ chartData, chartNamesAndColors, xType, yType }) => {
    const [data, setData] = useState([])
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
            <BarChart
                data={data}
            // margin={{
            //     top: 5,
            //     right: 30,
            //     left: 20,
            //     bottom: 5,
            // }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis>
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
                {namesAndColors.map((namesAndColor, index) => (
                    <Bar
                        key={index}
                        stackId="a"
                        name={namesAndColor.name}
                        dataKey={`additionalFields.${namesAndColor.name}`}
                        fill={namesAndColor.color}
                        activeBar={<Rectangle fill={darken(namesAndColor.color, 0.2)} stroke="blue" />}
                    />
                ))

                }
                {/* <Bar
                    name={"Task"}
                    dataKey={`additionalFields.${xType}`}
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                    {
                        chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={namesAndColors[index]?.color} />
                        ))
                    }
                </Bar> */}

            </BarChart>
        </ResponsiveContainer >
    )
}

export default CustomStackedBar;