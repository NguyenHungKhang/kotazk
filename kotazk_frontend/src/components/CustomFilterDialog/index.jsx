import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Popover, Button, IconButton, useTheme, Badge, styled } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomFilterItemDialog from './CustomFilterItemDialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        left: -3,
        top: 13,
        padding: '0 4px',
    },
}));

const CustomComponent = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const filters = useSelector((state) => state.filter.currentFilterList);
    const [filterDialogs, setFilterDialogs] = useState([]);
    const dispatch = useDispatch();
    const theme = useTheme();

    // useEffect(() => {
    //     if (filters && filterDialogs != filters)
    //         setFilterDialogs(filters)
    // }, [filters])


    useEffect(() => {
        if (filterDialogs)
            setGlobalFilter();
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
            <Badge badgeContent={filterDialogs ? filterDialogs.length : 0} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}
                sx={{
                    "& .MuiBadge-badge": {
                        fontSize: 10, p: 2, minWidth: 10, minHeight: 10, height: 15, width: 15
                    }
                }}>
                <Button
                    sx={{ textTransform: 'none' }}
                    color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                    size="small"
                    startIcon={<FilterListIcon fontSize="small" />}
                    onClick={handleClick}
                >

                    Filter

                </Button>
            </Badge>
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
                <Box sx={{ width: 500 }}>
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button onClick={handleClearAll} color="secondary" variant="text" size="small">
                                Clear All
                            </Button>
                        </Box>
                        {filterDialogs.map((filter, index) => (
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
