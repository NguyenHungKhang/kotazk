package com.taskmanagement.kotazk.payload.response.customization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustomizationResponseDto {
    Long id;
    String backgroundColor;
    String fontColor;
    String icon;
    String avatar;
}