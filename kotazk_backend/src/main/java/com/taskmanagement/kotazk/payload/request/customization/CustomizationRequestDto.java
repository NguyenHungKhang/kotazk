package com.taskmanagement.kotazk.payload.request.customization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustomizationRequestDto {
    String backgroundColor;
    String fontColor;
    String icon;
    String avatar;
}
