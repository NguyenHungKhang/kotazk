import React from 'react';
import { Avatar, Box, Card, Typography, Stack, Chip, IconButton } from '@mui/material';
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

const ProjectCard = ({ project, theme }) => {
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
        <Card
            onClick={() => handleNavigate()}
            sx={{
                cursor: 'pointer',
                transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                '&:hover .overlay': {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Tối hơn khi hover
                },
                '&:hover .projectName': {
                    textDecoration: 'underline'
                }
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                <Box
                    className="overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
                    {/* Thông tin project ở trên ảnh */}
                    <Box
                        sx={{
                            position: 'absolute',
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
                                    color="white"
                                >
                                    {project.name}
                                </Typography>
                            </Box>
                            <Box>
                                {project.isPinned ?
                                    <IconButton size='small' onClick={(e) => { e.stopPropagation(); handlePin(e); }}>
                                        <PinnedIcon size={18} color="white" />
                                    </IconButton>
                                    :
                                    <IconButton size='small' onClick={(e) => { e.stopPropagation(); handlePin(e); }}>
                                        <PinIcon size={18} color="white" />
                                    </IconButton>
                                }

                            </Box>
                        </Stack>
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
                            alt={project.member.user.lastName}
                            src={getAvatar(project.member.user.id, project.member.user.avatarUrl)}
                        >
                            {project.member.user.lastName.charAt(0)}
                        </Avatar>
                        <Box bgcolor={theme.palette.background.default} borderRadius={20}>
                            <Chip
                                label={project.status.toLowerCase()}
                                size='small'
                                color={project.status === 'ACTIVE' ? "success" : "error"}
                                sx={{
                                    textTransform: 'capitalize',
                                }}
                            />
                        </Box>
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
            </Box>
        </Card>
    );
};

export default ProjectCard;
