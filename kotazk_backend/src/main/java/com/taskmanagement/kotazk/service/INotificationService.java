package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.entity.Notification;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.notification.NotificationResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;

import java.util.List;

public interface INotificationService {
    PageResponse<NotificationResponseDto> getPageByUser(SearchParamRequestDto searchParamRequestDto);
    CustomResponse checkAll();
    CustomResponse setRead(Long notificationId);
    Notification createNotification(Notification notification);
    List<Notification> createNotifications(List<Notification> notifications);
}
