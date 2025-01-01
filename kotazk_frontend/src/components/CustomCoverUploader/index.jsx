import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { getProjectCover } from '../../utils/coverUtil';
import * as TablerIcons from '@tabler/icons-react';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index';
import { useDispatch } from 'react-redux';
import { setCurrentProject } from '../../redux/actions/project.action';
import { useSelector } from 'react-redux';

const CustomCoverUploader = ({ project }) => {
    const [file, setFile] = useState(null);
    const fileTypes = ["JPG", "PNG", "GIF"];
    const UploadIcon = TablerIcons["IconPhotoUp"];
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const modifyPermission = currentMember?.role?.projectPermissions?.includes("MODIFY_PROJECT");

    const handleChange = (file) => {
        setFile(file);
    };

    const handleRemove = () => {
        setFile(null);
    };

    const getCoverImage = () => {
        if (file) {
            console.log(123);
        }
        return getProjectCover(project?.id, project?.cover);
    };

    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const handleSaveFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadInProgress(true);
            setUploadPercent(0);

            const response = await apiService.projectAPI.uploadCover(file, project?.id)

            if (response?.data) {
                dispatch(setCurrentProject(response?.data))

            }
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploadInProgress(false);
            setUploadPercent(0); // Reset progress after completion or failure
        }
    };

    return (
        <Box sx={{ textAlign: "center", margin: "0 auto" }}>
            {/* Upload Controls */}
            <Box sx={{ marginTop: 2 }}>
                {file ? (
                    <Button variant="outlined" color="secondary" onClick={handleRemove}>
                        Remove
                    </Button>
                ) : (
                    <FileUploader handleChange={handleSaveFile} name="cover" types={fileTypes} disabled={!modifyPermission}>
                        <Box sx={{ position: "relative", width: "100%" }}>
                            {modifyPermission && (
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 1,
                                        borderRadius: 1,
                                        transition: 'background-color 0.3s ease-in-out',
                                        border: '4px dashed',
                                        borderColor: "transparent",
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        "& .upload_content": {
                                            display: 'none'
                                        },
                                        "&:hover": {
                                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                            borderColor: "#fff",
                                        },
                                        "&:hover .upload_content": {
                                            display: 'flex'
                                        }
                                    }}
                                >
                                    <Stack className="upload_content" justifyContent={"center"} alignItems={'center'} spacing={2}>
                                        <Box>
                                            <UploadIcon size={100} color='#fff' />
                                        </Box>
                                        <Box>
                                            <Typography variant='h6' color='white' fontWeight={650} textAlign={'center'}>
                                                Click browse or drop image for a new cover
                                            </Typography>
                                            <Typography variant='h6' color='white' fontWeight={650} textAlign={'center'}>
                                                JPG, PNG, GIF
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            )}


                            <Box
                                sx={{
                                    width: "100%",
                                    paddingTop: "56.25%",
                                    backgroundImage: `url(${getCoverImage()})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: 1,
                                    position: "relative",
                                }}
                            />
                        </Box>
                    </FileUploader>
                )}
            </Box>
        </Box>
    );
};

export default CustomCoverUploader;
