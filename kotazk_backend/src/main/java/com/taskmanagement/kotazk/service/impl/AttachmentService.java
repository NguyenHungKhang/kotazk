package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.attachment.AttachmentRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.IAttachmentService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttachmentService implements IAttachmentService {

    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private IAttachmentRepository attachmentRepository;
    @Autowired
    private IMemberRepository memberRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Attachment> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public AttachmentResponseDto create(MultipartFile file, Long taskId) throws IOException {
        User currentUser = SecurityUtil.getCurrentUser();
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        Project project = task.getProject();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.CREATE_ATTACHMENTS))
            throw new CustomException("This user do not have permission to add attachment in this task");

        // add task_comment case later

        String fileName = file.getOriginalFilename();
        String fileSize = String.valueOf(file.getSize());
        String fileType;

        if (fileName != null && fileName.contains(".")) {
            fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
        } else {
            fileType = ""; // No extension found
        }
        Boolean isHidden = false;
        AttachmentType type = AttachmentType.FOR_TASK;

        String fileUrl = fileUtil.uploadFile(file, "file-task-"+task.getId()+"-"+UUID.randomUUID().toString());

        Attachment attachment = Attachment.builder()
                .fileName(fileName)
                .fileType(fileType)
                .fileSize(fileSize)
                .fileUrl(fileUrl)
                .isHidden(isHidden)
                .task(task)
                .type(type)
                .position(RepositionUtil.calculateNewLastPosition(task.getAttachments().size()))
                .build();

        Attachment savedAttachment = attachmentRepository.save(attachment);

        return ModelMapperUtil.mapOne(savedAttachment, AttachmentResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) throws IOException {
        User currentUser = SecurityUtil.getCurrentUser();
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", id));
        Task task = attachment.getTask();
        Project project = task.getProject();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.DELETE_ALL_ATTACHMENTS))
            throw new CustomException("This user do not have permission to add attachment in this task");

        String url = attachment.getFileUrl();
        attachmentRepository.delete(attachment);
        fileUtil.deleteFile(url);

        return true;
    }

    @Override
    public AttachmentResponseDto getOne(Long id) {
        return null;
    }

    @Override
    public PageResponse<AttachmentResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId) {
        return null;
    }

    @Override
    public PageResponse<AttachmentResponseDto> getPageByTask(SearchParamRequestDto searchParams, Long taskId) {
        return null;
    }
}
