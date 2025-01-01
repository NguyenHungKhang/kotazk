import React, { useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faFileExcel, faFilePowerpoint, faFilePdf, faFileText, faFileVideo } from '@fortawesome/free-solid-svg-icons';

import * as apiService from '../../api/index';
import * as TablerIcons from '@tabler/icons-react';
import { Box, CircularProgress, IconButton, LinearProgress, Link, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';
import { useDispatch, useSelector } from 'react-redux';
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from '../../redux/actions/task.action';
import { setDeleteDialog, setTaskDialog } from '../../redux/actions/dialog.action';
import axiosInstance from '../../api/axios.interceptor';

const fileTypes = ["PDF", "JPG", "PNG", "GIF", "MP4", "PPTX", "DOCX", "XLSX", "TXT", "DOC", "XLS", "PPT"];

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function CustomFileUploader({ currentFiles, task }) {
  const dispatch = useDispatch();
  const isGroupedList = useSelector((state) => state.task.isGroupedList);
  const currentMember = useSelector((state) => state.member.currentUserMember);

  const [files, setFiles] = useState([]);
  const theme = useTheme();

  const DownloadIcon = TablerIcons["IconDownload"]
  const RemoveIcon = TablerIcons["IconX"]
  const AttachmentIcon = TablerIcons["IconPaperclip"]
  const FileUploadIcon = TablerIcons["IconFileUpload"];
  const AddIcon = TablerIcons["IconPlus"];

  useEffect(() => {
    setFiles(currentFiles);
  }, [currentFiles]);

  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const handleSaveFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadInProgress(true);
      setUploadPercent(0); // Reset the progress to 0 before starting the upload

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_API_URL}/${process.env.REACT_APP_SECURE_PART_URL}/attachment/for-task/${task?.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const percent = (progressEvent.loaded / progressEvent.total) * 100 - 1;
              setUploadPercent(Math.round(percent)); // Update the progress state
            }
          },
          timeout: 60000
        }
      );

      if (response?.data) {
        const updatedTask = {
          ...task,
          attachments: [...task?.attachments, response.data],
        };

        if (isGroupedList) {
          dispatch(addAndUpdateGroupedTaskList(updatedTask));
        } else {
          dispatch(addAndUpdateTaskList(updatedTask));
        }

        const taskDialogData = { task: updatedTask };
        dispatch(setTaskDialog(taskDialogData));

      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadInProgress(false);
      setUploadPercent(0); // Reset progress after completion or failure
    }
  };




  const handleRemoveFile = async (event, file) => {
    event.stopPropagation();
    dispatch(setDeleteDialog({
      title: `Delete attachment "${file?.fileName}"?`,
      content:
        `You're about to permanently delete this attachment.
            <br/><br/>
            If you're not sure, you can resolve or close this attachment instead.`,
      open: true,
      deleteType: "DELETE_TASK_ATTACHMENT",
      deleteProps: {
        attachmentId: file?.id,
        task: task
      }
      // deleteAction: () => handleDelete(),
    }));
  };

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    let kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    let mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    let gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  async function downloadFile(filename, fileUrl) {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('File download failed:', error);
    }
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography color={theme.palette.text.secondary} >
          Max size of each file: 10MB
        </Typography>
        <Typography color={theme.palette.text.secondary}>
          Extentions file support: {fileTypes.map(ext => `.${ext.toLowerCase()}`).join(" ")}
        </Typography>
      </Box>
      <Box
        p={2}
        borderRadius={2}
        border={"1px solid"}
        borderColor={'ActiveBorder !important'}
      >

        <Stack direction={'row'} spacing={2} useFlexGap flexWrap="wrap" alignItems={'center'}>
          {currentMember?.role?.projectPermissions.includes("CREATE_ATTACHMENTS") && (
            <Box
              sx={{ width: currentFiles?.length == 0 ? '100%' : '32.5%' }}
            >

              <FileUploader
                handleChange={handleSaveFile}
                name="file"
                types={fileTypes}
                maxSize={10}
              > <Tooltip title='Add new attachments' arrow placement="top">
                  <Box
                    bgcolor={getSecondBackgroundColor(theme)}
                    p={2}
                    height={58}
                    borderRadius={2}
                    border={"1px dashed"}
                    sx={{
                      "&:hover": {
                        bgcolor: getCustomTwoModeColor(theme, theme.palette.grey[200], theme.palette.grey[800])
                      }
                    }}
                  >
                    <Stack direction={'row'} spacing={2} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                      <AddIcon size={30} stroke={1.5} color={theme.palette.text.secondary} />
                      {/* <Box> */}
                      {/* <Typography fontSize={16} fontWeight={'bold'}>
                    Drop files here or click to browse attachments
                  </Typography> */}
                      {/* <Typography color={theme.palette.text.secondary} >
                    Max size: 10MB
                  </Typography> */}
                      {/* <Typography color={theme.palette.text.secondary}>
                    Extentions file support: {fileTypes.map(ext => `.${ext.toLowerCase()}`).join(" ")}
                  </Typography> */}
                      {/* </Box> */}
                    </Stack>
                  </Box >
                </Tooltip >
              </FileUploader >

            </Box >
          )
          }
          {
            currentFiles?.map((file, index) => (
              <Box key={index} bgcolor={getSecondBackgroundColor(theme)} p={2} borderRadius={2}
                sx={{
                  width: '32.5%',
                  border: '1px solid',
                  borderColor: 'transparent',
                  '&:hover': {
                    borderColor: 'ThreeDDarkShadow'
                  }
                }}
              >
                <Tooltip title={file.fileName} placement="top" arrow>
                  <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    {(file.fileType == "jpg" || file.fileType == "png" || file.fileType == "gif") && (
                      <Box>
                        <Box
                          width={42}
                          height={42}
                        >
                          <div style={{
                            position: 'relative',
                            paddingTop: '100%',
                          }}>
                            <Box
                              component="img"
                              src={file.fileUrl}
                              alt="Image Preview"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                borderRadius: 2,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }} />
                          </div>
                        </Box>
                      </Box>
                    )}
                    {(file.fileType == "doc" || file.fileType == "docx") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFileWord} size='3x' />
                      </Box>
                    )}
                    {(file.fileType == "xls" || file.fileType == "xlsx") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFileExcel} size='3x' />
                      </Box>
                    )}
                    {(file.fileType == "ppt" || file.fileType == "pptx") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFilePowerpoint} size='3x' />
                      </Box>
                    )}
                    {(file.fileType == "txt") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFileText} size='3x' />
                      </Box>
                    )}
                    {(file.fileType == "pdf") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFilePdf} size='3x' />
                      </Box>
                    )}
                    {(file.fileType == "mp4") && (
                      <Box
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <FontAwesomeIcon icon={faFileVideo} size='3x' />
                      </Box>
                    )}
                    <Box flexGrow={1} width={'100%'} sx={{ overflow: "hidden !important" }}>
                      <Typography
                        textAlign={'start'}
                        fontWeight={650}
                        onClick={() => downloadFile(file.fileName, file.fileUrl)}
                        color={theme.palette.text.primary}
                        noWrap
                      >
                        {file.fileName}
                      </Typography>
                      <Typography textAlign={'start'} color={theme.palette.text.secondary}>
                        {formatFileSize(file.fileSize)}
                      </Typography>
                    </Box>
                    <IconButton size='small' onClick={() => downloadFile(file.fileName, file.fileUrl)}>
                      <DownloadIcon size={16} />
                    </IconButton>
                    {currentMember?.role?.projectPermissions.includes("CREATE_ATTACHMENTS")

                    }
                    <IconButton size='small' onClick={(e) => handleRemoveFile(e, file)}>
                      <RemoveIcon size={16} />
                    </IconButton>
                  </Stack>
                </Tooltip>
              </Box>
            ))
          }
          {
            uploadInProgress && (
              <Box bgcolor={getSecondBackgroundColor(theme)} p={2} borderRadius={2}
                sx={{
                  width: '32.5%',
                  border: '1px solid',
                  borderColor: 'transparent',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                  </Box>
                </Box>
              </Box>
            )
          }

        </Stack >
      </Box >
    </Box>
  );
}

export default CustomFileUploader;
