package com.taskmanagement.kotazk.payload.request.setting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SettingRequestDto {
    String key;
    String value;
}
