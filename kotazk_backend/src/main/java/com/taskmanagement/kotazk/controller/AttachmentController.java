package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.attachment.AttachmentRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.service.IAttachmentService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.service.impl.AttachmentService;
import com.taskmanagement.kotazk.service.impl.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/attachment")
public class AttachmentController {
    @Autowired
    IAttachmentService attachmentService = new AttachmentService();
    @PostMapping("/for-task/{taskId}")
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentResponseDto create(@Valid @RequestBody MultipartFile file, @PathVariable Long taskId) throws IOException {
        return attachmentService.create(file, taskId);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Boolean delete(@PathVariable Long taskId) throws IOException {
        return attachmentService.delete(taskId);
    }
}
