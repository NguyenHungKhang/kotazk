package com.taskmanagement.kotazk.payload.response.section;

import com.taskmanagement.kotazk.entity.enums.SectionType;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SectionResponseDto {
    Long id;
    String name;
    String description;
    Long workSpaceId;
    Long projectId;
    CustomizationRequestDto customization;
    Long position;
    SectionType type;
}
