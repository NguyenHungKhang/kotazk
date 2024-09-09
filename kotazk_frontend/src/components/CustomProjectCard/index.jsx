import React from 'react';
import { Avatar, Box, Card, Typography, Stack, Chip } from '@mui/material';
import { alpha } from '@mui/material';

const ProjectCard = ({ project, theme }) => {
    return (
        <Card
            sx={{
                transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                '&:hover .overlay': {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Tối hơn khi hover
                },
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                {/* Lớp phủ tối toàn bộ ảnh */}
                <Box
                    className="overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Tối đi với mức độ 0.3
                        zIndex: 1,
                        borderRadius: 2, // Bo góc cho ảnh
                        transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                    }}
                />

                <Box
                    sx={{
                        width: '100%',
                        paddingTop: '56.25%', // Tỉ lệ 16:9
                        backgroundImage: 'url("https://assets.justinmind.com/wp-content/uploads/2018/11/Lorem-Ipsum-alternatives-768x492.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 2,
                        position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                    }}
                >
                    {/* Thông tin project ở trên ảnh */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 2,  // Đảm bảo nội dung nằm trên lớp phủ
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={650} color="white">
                            {project.name}
                        </Typography>
                    </Box>

                    {/* Stack ở dưới cùng của ảnh */}
                    <Stack
                        direction='row'
                        spacing={2}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            p: 2,
                            zIndex: 2,  // Đảm bảo Stack nằm trên lớp phủ
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                            }}
                        >
                            {project.member.user.lastName.charAt(0)}
                        </Avatar>
                        <Box bgcolor={theme.palette.background.default} borderRadius={20}>
                            <Chip label={project.status.toLowerCase()} size='small'
                                sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.2),
                                    color: theme.palette.success.main,
                                    textTransform: 'capitalize',
                                }}
                            />
                        </Box>
                        <Box bgcolor={theme.palette.background.default} borderRadius={20}>
                            <Chip label={project.visibility.toLowerCase()} size='small'
                                sx={{
                                    bgcolor: project.visibility === 'PUBLIC' ? alpha(theme.palette.warning.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                                    color: project.visibility === 'PUBLIC' ? theme.palette.warning.main : theme.palette.error.main,
                                    textTransform: 'capitalize',
                                }} />
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Card>
    );
};

export default ProjectCard;
