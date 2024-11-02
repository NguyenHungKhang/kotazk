package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.attachment.AttachmentRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.label.LabelRequestDto;
import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IAttachmentService {
    AttachmentResponseDto create(MultipartFile file, Long taskId) throws IOException;

    Boolean delete(Long id) throws IOException;

    //    Boolean softDelete(Long id);
    AttachmentResponseDto getOne(Long id);

    PageResponse<AttachmentResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId);

    PageResponse<AttachmentResponseDto> getPageByTask(SearchParamRequestDto searchParams, Long taskId);
}
