package com.taskmanagement.kotazk.payload.response.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RePositionResponseDto {
    Long id;
    Long newPosition;
}
