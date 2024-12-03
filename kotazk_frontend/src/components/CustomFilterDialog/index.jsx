import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Popover, Button, IconButton, useTheme, Badge, styled, Stack, Typography, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomFilterItemDialog from './CustomFilterItemDialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';
import { useParams } from 'react-router-dom';


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        left: -3,
        top: 13,
        padding: '0 4px',
    },
}));

const CustomComponent = ({ section }) => {
    const { sectionId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const filters = useSelector((state) => state.filter.currentFilterList);
    const userChangeFilterList = useSelector((state) => state.filter.userChangeFilterList);
    const [filterDialogs, setFilterDialogs] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        if (!isInitialLoad)
            setIsInitialLoad(true)
    }, [sectionId, section])

    useEffect(() => {
        if (filters && isInitialLoad) {
            setFilterDialogs(filters);
        }
    }, [filters])

    useEffect(() => {
        if (filterDialogs && !isInitialLoad)
            setGlobalFilter();
        else if (filterDialogs && filters && isInitialLoad)
            setIsInitialLoad(false);
        console.log("access");
    }, [filterDialogs])



    const setGlobalFilter = () => {
        const globalFilters = filterDialogs.filter(f => f.field != null && f.options.length > 0);
        dispatch(setCurrentFilterList(globalFilters))
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setFilterDialogs(filterDialogs.filter(f => f.field != null && f.options.length > 0));
    };

    const handleAddFilter = () => {
        setFilterDialogs([...filterDialogs, {
            "field": null,
            "options": []
        }]);
    };

    const handleClearAll = () => {
        setFilterDialogs([]);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <div>
            <Button
                sx={{ textTransform: 'none', textWrap: 'nowrap' }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                // variant='outlined'
                startIcon={<FilterListIcon fontSize="small" />}
                onClick={handleClick}
            >
                <Stack direction='row' spacing={1} alignItems={'center'}>
                    <Box>
                        Filter
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        width={16}
                        height={16}
                        bgcolor={getCustomTwoModeColor(theme, "#000", "#fff")}
                        p={1}
                        borderRadius={1}
                    >
                        <Typography variant='body2' color={getCustomTwoModeColor(theme, "#fff", "#000")}>
                            {filterDialogs ? filterDialogs.length : 0}
                        </Typography>
                    </Box>
                </Stack>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 500, p: 2 }}>
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                            <Typography variant='h6'>
                                Filter
                            </Typography>
                            <Button onClick={handleClearAll} color="secondary" variant="text" size="small">
                                Clear All
                            </Button>
                        </Box>
                        {filterDialogs?.length == 0 && (
                            <Divider>
                                <Typography textAlign={'center'} color='textSecondary'>
                                    <i>No filters are applied</i>
                                </Typography>
                            </Divider>
                        )}
                        {filterDialogs?.map((filter, index) => (
                            <CustomFilterItemDialog key={index} filter={filter} setFilterDialogs={setFilterDialogs} index={index} />
                        ))}
                        <Button onClick={handleAddFilter} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} variant="text" size='small' sx={{ textAlign: 'start' }}>
                            Add Filter...
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomComponent;
