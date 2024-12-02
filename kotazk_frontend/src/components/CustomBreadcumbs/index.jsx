import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const dummyData = [
    { label: 'Home', href: '#' },
    { label: 'Catalog', href: '#' },
    { label: 'Accessories' },
];
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
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function CustomBreadcrumb({data}) {
    return (
        <Box
            mt={2}
            sx={{
                pl: 9,
                position: 'relative', // Để pseudo-element có thể được định vị tương đối
                // overflow: 'hidden', // Để đảm bảo pseudo-element không tràn ra ngoài Box
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -5, // Điều chỉnh vị trí của đường cong
                    left: 10,
                    width: 18,
                    height: 21, // Chiều cao của đường cong
                    background: 'transparent', // Màu sắc của đường cong
                    // Tạo đường cong hình elip
                    border: "2px solid grey",
                    borderBottomLeftRadius: 12,
                    borderTop: "none",
                    // borderBottom: "none",
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
                            // onClick={item.href ? handleClick : undefined}
                        />
                    ))}
                </Breadcrumbs>
            </div>
        </Box>
    );
}
