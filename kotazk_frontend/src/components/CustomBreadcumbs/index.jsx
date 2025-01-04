import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(6),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function CustomBreadcrumb() {
    const location = useLocation();
    const currentPath = location.pathname;
    const [data, setData] = useState(null);
    const [display, setDisplay] = useState(false);
    const project = useSelector((state) => state.project.currentProject);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);

    useEffect(() => {
        if (currentPath.includes("workspace")) {
            setDisplay(false);
            setData([
                {
                    "label": "Home",
                },
            ])
        } else if (workspace && currentPath.startsWith("/workspace/")) {
            setDisplay(true);
            setData([
                {
                    "label": "Home",
                    "href": `/workspace`
                },
                {
                    "label": workspace?.name,
                },
            ])
        } else if (project && workspace && currentPath.startsWith("/project/")) {
            setDisplay(true);
            setData([
                {
                    "label": "Home",
                    "href": `/workspace`
                },
                {
                    "label": workspace?.name,
                    "href": `/workspace/${workspace?.id}/projects`
                },
                {
                    "label": project?.name,
                }
            ])
        } else {
            setDisplay(false);
            setData([
                {
                    "label": "Home",
                },
            ])
        }
    }, [currentPath, project, workspace]);

    return (
        <Box
            mt={2}
            sx={{
                pl: 9,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -5,
                    left: 10,
                    width: 18,
                    height: 21,
                    background: 'transparent',
                    border: "2px solid grey",
                    borderBottomLeftRadius: 12,
                    borderTop: "none",
                    borderRight: "none"
                },
            }}
        >
            <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb">
                    {data?.map((item, index) => (
                        <StyledBreadcrumb
                            key={index}
                            component={Link}
                            to={item.href || '#'}
                            label={item.label}
                            sx={{
                                cursor: item.href && 'pointer'
                            }}
                        />
                    ))}
                </Breadcrumbs>
            </div>
        </Box>
    );
}
