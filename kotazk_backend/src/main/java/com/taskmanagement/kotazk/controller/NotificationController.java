package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.notification.NotificationResponseDto;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.INotificationService;
import com.taskmanagement.kotazk.service.impl.MemberRoleService;
import com.taskmanagement.kotazk.service.impl.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/notification")
public class NotificationController {

    @Autowired
    INotificationService notificationService = new NotificationService();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @PostMapping("/page")
    public PageResponse<NotificationResponseDto> getNotificationsByUser(@Valid @RequestBody SearchParamRequestDto searchParam) {
        return notificationService.getPageByUser(searchParam);
    }

    @PutMapping("/{id}/read")
    public CustomResponse markAsRead(@PathVariable Long id) {
        return notificationService.setRead(id);
    }

    @PutMapping("/check")
    public CustomResponse markAsRead() {
        return notificationService.checkAll();
    }

    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationResponseDto notification) {
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}
