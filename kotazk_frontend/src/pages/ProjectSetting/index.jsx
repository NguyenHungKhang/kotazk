import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import StatusSetting from './StatusSetting';
import TaskTypeSetting from './TaskTypeSetting';
import PrioritySetting from './PrioritySetting';

const dummyData = [
    { title: "General", component: "General" },
    { title: "Status", component: <StatusSetting />},
    { title: "Task type", component: <TaskTypeSetting /> },
    { title: "Label", component: "Label" },
    { title: "Priority", component: <PrioritySetting /> },
    { title: "Custom field", component: "Custom field" },
]

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ProjectSetting() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Setting tabs" textColor="secondary" indicatorColor="secondary">
                    {dummyData.map((item, index) => (
                        <Tab key={index} label={item.title} {...a11yProps(index)}
                            sx={{
                                textTransform: 'none'
                            }}
                        />
                    ))}
                </Tabs>
            </Box>
            {dummyData.map((item, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {item.component}
                </CustomTabPanel>
            ))}
        </Paper>
    );
}
