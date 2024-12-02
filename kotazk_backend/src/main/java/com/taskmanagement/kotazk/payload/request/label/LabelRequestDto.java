package com.taskmanagement.kotazk.payload.request.label;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class LabelRequestDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    CustomizationRequestDto customization;
    String name;
}
