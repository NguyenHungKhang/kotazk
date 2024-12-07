package com.taskmanagement.kotazk.payload.response.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class NotificationResponseDto {
    Long id;
    Long userId;
    String title;
    String message;
    Boolean isRead;
    Boolean isCheck;
    String actionUrl;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
