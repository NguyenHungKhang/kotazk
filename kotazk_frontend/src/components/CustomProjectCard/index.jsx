import React from 'react';
import { Avatar, Box, Card, Typography, Stack, Chip, IconButton, Divider, Paper, useTheme } from '@mui/material';
import { alpha } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as TablerIcons from "@tabler/icons-react";
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import { updateAndAddArray } from '../../utils/arrayUtil';
import { useDispatch } from 'react-redux';
import { getAvatar } from '../../utils/avatarUtil';
import { getProjectCover } from '../../utils/coverUtil';

const ProjectCard = ({ project }) => {
    const theme = useTheme();
    const PinIcon = TablerIcons["IconPin"];
    const PinnedIcon = TablerIcons["IconPinnedFilled"];
    const projectList = useSelector((state) => state.project.currentProjectList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePin = async (event) => {
        const data = {
            isPinned: !project?.isPinned
        }

        const response = await apiService.projectAPI.update(project?.id, data);
        if (response?.data) {
            const finalProjectList = {
                ...projectList,
                content: updateAndAddArray(projectList.content, [response?.data])
            }
            dispatch(setCurrentProjectList(finalProjectList))
        }

    }

    const handleNavigate = () => {
        navigate(`/project/${project.id}`);
    }

    return (
        <Paper
            onClick={() => handleNavigate()}
            sx={{
                cursor: 'pointer',
                boxShadow: 0,
                borderColor: "InactiveBorder !important",
                border: "1px solid",
                transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                '&:hover': {
                    borderColor: `${theme.palette.info.main} !important`, // Tối hơn khi hover
                },
                '&:hover .projectName': {
                    textDecoration: 'underline'
                }
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                <Box
                    // className="overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        zIndex: 1,
                        borderRadius: 2,
                        transition: 'background-color 0.3s ease-in-out',
                    }}
                />

                <Box
                    sx={{
                        width: '100%',
                        paddingTop: '56.25%', // Tỉ lệ 16:9
                        backgroundImage: `url(${getProjectCover(project?.id, project?.cover)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 1,
                        position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 2,  // Đảm bảo nội dung nằm trên lớp phủ
                            p: 0,
                            m: 1,
                            borderRadius: 10,
                            bgcolor: theme.palette.background.paper
                        }}
                    >

                        {project.isPinned ?
                            <IconButton size='small' onClick={(e) => { e.stopPropagation(); handlePin(e); }}>
                                <PinnedIcon size={18} />
                            </IconButton>
                            :
                            <IconButton size='small' onClick={(e) => { e.stopPropagation(); handlePin(e); }}>
                                <PinIcon size={18} />
                            </IconButton>
                        }
                    </Box>
                </Box>

                {/* Thông tin project ở trên ảnh */}
                <Box
                    sx={{
                        // position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2,  // Đảm bảo nội dung nằm trên lớp phủ
                        p: 2,
                        borderRadius: 2,
                        width: '100%'
                    }}
                >
                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                        <Box flexGrow={1}>
                            <Typography
                                className='projectName'
                                variant="h6"
                                fontWeight={650}
                            >
                                {project.name}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box
                        sx={{
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.5rem', // Adjust based on your font size
                            minHeight: '1.5rem', // 2 lines * lineHeight
                        }}
                    >
                        {project.description}
                    </Box>


                </Box>

                <Divider />

                <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                        // position: 'absolute',
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
                        alt={project.member.user.lastName}
                        src={getAvatar(project.member.user.id, project.member.user.avatar)}
                    >
                        {project.member.user.lastName.charAt(0)}
                    </Avatar>
                    <Box bgcolor={theme.palette.background.default} borderRadius={20}>
                        <Chip
                            label={project.visibility.toLowerCase()}
                            size='small'
                            color={project.visibility === 'PUBLIC' ? "info" : "error"}
                            sx={{
                                textTransform: 'capitalize',
                            }}
                        />
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ProjectCard;
