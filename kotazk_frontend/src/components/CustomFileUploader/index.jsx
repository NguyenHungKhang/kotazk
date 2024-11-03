import React, { useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FileUploader } from "react-drag-drop-files";

import * as apiService from '../../api/index';
import * as TablerIcons from '@tabler/icons-react';
import { Box, IconButton, Link, Stack, Typography, useTheme } from '@mui/material';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { useDispatch, useSelector } from 'react-redux';
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from '../../redux/actions/task.action';
import { setDeleteDialog, setTaskDialog } from '../../redux/actions/dialog.action';

const fileTypes = ["JPEG", "PNG", "GIF"];

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function CustomFileUploader({ currentFiles, task }) {
  const dispatch = useDispatch();
  const isGroupedList = useSelector((state) => state.task.isGroupedList);

  const [files, setFiles] = useState([]);
  const theme = useTheme();

  const DownloadIcon = TablerIcons["IconDownload"]
  const RemoveIcon = TablerIcons["IconX"]
  const AttachmentIcon = TablerIcons["IconPaperclip"]

  useEffect(() => {
    setFiles(currentFiles);
  }, [currentFiles]);

  const handleSaveFile = async (file) => {
    try {
      const response = await apiService.attachmentAPI.createForTask(task?.id, file);
      if (response?.data) {
        const updatedTask = {
          ...task,
          attachments: [...task?.attachments, response?.data]
        }
        if (isGroupedList)
          dispatch(addAndUpdateGroupedTaskList(updatedTask))
        else
          dispatch(addAndUpdateTaskList(updatedTask));

        const taskDialogData = {
          task: updatedTask
        };
        dispatch(setTaskDialog(taskDialogData));
      }
    } catch (err) {
      console.log('Upload aborted');
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
    <div className="App">
      <Box>
        <FileUploader
          handleChange={handleSaveFile}
          name="file"
          types={fileTypes}
        >
          <Box
            bgcolor={getSecondBackgroundColor(theme)}
            p={2}
            height={80} borderRadius={2}
            border={"1px dashed"}
          >
            <Stack direction={'row'} spacing={2} height={'100%'} alignItems={'center'} >
              <AttachmentIcon />
              <Box>
                <Typography>
                  Drop files here or click to browse attachments
                </Typography>
              </Box>
            </Stack>

          </Box>
        </FileUploader>
      </Box>
      <Stack direction={'row'} spacing={2} mt={2}>

        {currentFiles?.map((file, index) => (
          <Box key={index} bgcolor={getSecondBackgroundColor(theme)} p={2} borderRadius={2}
            sx={{
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'ThreeDDarkShadow'
              }
            }}
          >
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Box
                width={60}
                height={60}

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
              <Box>
                <Link component={'button'} textAlign={'start'} fontWeight={650} onClick={() => downloadFile(file.fileName, file.fileUrl)} underline='hover' color={theme.palette.text.primary}>
                  {file.fileName}
                </Link>
                <Typography textAlign={'start'} color={theme.palette.text.secondary}>
                  {formatFileSize(file.fileSize)}
                </Typography>
              </Box>
              <IconButton size='small' onClick={() => downloadFile(file.fileName, file.fileUrl)}>
                <DownloadIcon size={16} />
              </IconButton>
              <IconButton size='small' onClick={(e) => handleRemoveFile(e, file)}>
                <RemoveIcon size={16} />
              </IconButton>
            </Stack>

          </Box>
        ))}
      </Stack>
    </div>
  );
}

export default CustomFileUploader;
