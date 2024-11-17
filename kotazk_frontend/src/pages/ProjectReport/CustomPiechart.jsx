import { darken, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getSecondBackgroundColor } from '../../utils/themeUtil';

const CustomPiechart = ({ chartData, chartNamesAndColors, xType, yType }) => {

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
            <PieChart>

                <Legend align='right' layout={'vertical'} verticalAlign='middle' />
                <Pie
                    label
                    data={data}
                    // innerRadius={60}
                    // outerRadius={100}
                    paddingAngle={1}
                    name={yType == "TASK_COUNT" ? "Tasks" : "Time estimate"}
                    dataKey={`additionalFields.${xType}`}
                >
                    {
                        chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`}
                                fill={namesAndColors[index]?.color} />
                        ))
                    }
                </Pie>
                <Tooltip
                    itemStyle={{
                        color: `${yType == "TASK_COUNT" ? theme.palette.success.main : theme.palette.primary.main} !important`
                    }}
                    contentStyle={{
                        backgroundColor: theme.palette.background.default,
                        borderColor: getSecondBackgroundColor(theme),
                        borderRadius: 8,
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default CustomPiechart;