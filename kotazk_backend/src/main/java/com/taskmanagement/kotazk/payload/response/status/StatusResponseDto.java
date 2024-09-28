package com.taskmanagement.kotazk.payload.response.status;

import com.taskmanagement.kotazk.payload.response.customization.CustomizationResponseDto;
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
public class StatusResponseDto {
    Long id;
    Long projectId;
    Boolean isFromAny;
    Boolean isFromStart;
    Boolean isCompletedStatus;
    Boolean systemInitial;
    Boolean systemRequired ;
    CustomizationResponseDto customization;
    Long position;
    String name;
    String description;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
