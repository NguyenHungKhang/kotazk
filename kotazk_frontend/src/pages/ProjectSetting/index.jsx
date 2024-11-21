import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Card, Paper, TextField } from '@mui/material';
import CustomManageStatus from '../../components/CustomManageStatusDialog';
import CustomManageTaskType from '../../components/CustomManageTaskType';
import CustomManagePriority from '../../components/CustomManagePriority';
import CustomManageLabel from '../../components/CustomManageLabel';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import { useSelector } from 'react-redux';

const dummyData = [
    { title: "General", component: "General" },
    { title: "Status", component: <CustomManageStatus /> },
    { title: "Task type", component: <CustomManageTaskType /> },
    { title: "Label", component: <CustomManageLabel /> },
    { title: "Priority", component: <CustomManagePriority /> },
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
            {value === index && <Box height={'100%'}>{children}</Box>}
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

    const project = useSelector((state) => state.project.currentProject);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Paper sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="Setting tabs" textColor="secondary" indicatorColor="secondary">
                    {dummyData.map((item, index) => (
                        <Tab key={index} label={item.title} {...a11yProps(index)}
                            sx={{
                                textTransform: 'none'
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>
            {dummyData.map((item, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {item.component}
                </CustomTabPanel>
            ))}
        </Box>
        // <>
        //     <Card
        //         sx={{
        //             height: '100%'
        //         }}
        //     >
        //         <TextField size='small' defaultValue={project?.name} />
        //         <TextField multiline rows={4} placeholder='description' />
        //     </Card>
        // </>
    );
}
