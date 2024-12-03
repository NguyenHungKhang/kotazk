import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Popover, Button, IconButton, useTheme, Badge, styled, Stack, Typography, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';
import { useParams } from 'react-router-dom';
import FilterItem from './FilterItem';
import { options } from '@fullcalendar/core/preact';


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        left: -3,
        top: 13,
        padding: '0 4px',
    },
}));

const FilterList = ({ projectReport, currentFilters, setCurrentFilters }) => {
    const [filters, setFilters] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (projectReport) {
            console.log(projectReport);
            setFilters(projectReport?.filterSettings?.map(f => ({
                field: f.field,
                options: f.values
            })));
        }
    }, [projectReport])

    useEffect(() => {
        if (filters) {
            const finalFilters = filters
                .filter(f => f.field != null && f.options.length > 0)
                .map(f => ({
                    ...f,
                    operator: f.field === "startAt"
                        ? "GREATER_THAN_OR_EQUAL"
                        : f.field === "endAt"
                            ? "LESS_THAN_OR_EQUAL"
                            : "IN",
                    values: f.options,
                    options: null
                    // value: f.field === "startAt" && f.field === "endAt" ? options?.[0] : null,
                }));
            if (currentFilters != finalFilters)
                setCurrentFilters(finalFilters);
        }
    }, [filters])

    const handleAddFilter = () => {
        const globalFilters = [...filters, {
            "field": null,
            "options": []
        }];
        setFilters(globalFilters)
    };

    const handleClearAll = () => {
        setFilters([]);
    };

    return (
        <div>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
                <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                    <Typography>
                        Filter
                    </Typography>
                    <Button onClick={handleClearAll} color="secondary" variant="text" size="small">
                        Clear All
                    </Button>
                </Box>
                {filters?.length == 0 && (
                    <Divider>
                        <Typography color='textSecondary'>
                            <i>No filters are applied</i>
                        </Typography>
                    </Divider>
                )}
                {filters?.map((filter, index) => (
                    <FilterItem key={index} filter={filter} setFilters={setFilters} index={index} />
                ))}
                <Button onClick={handleAddFilter} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} variant="text" size='small' sx={{ textAlign: 'start' }}>
                    Add Filter...
                </Button>
            </Box>
        </div>
    );
};

export default FilterList;
