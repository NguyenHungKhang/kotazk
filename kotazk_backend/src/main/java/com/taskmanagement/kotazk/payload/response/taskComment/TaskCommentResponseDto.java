package com.taskmanagement.kotazk.payload.response.taskComment;

import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskCommentResponseDto {
    Long id;
    Long taskId;
    MemberResponseDto member;
    UserResponseDto user;
    String content;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
