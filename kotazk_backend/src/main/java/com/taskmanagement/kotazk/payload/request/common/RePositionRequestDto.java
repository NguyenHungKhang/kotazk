package com.taskmanagement.kotazk.payload.request.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RePositionRequestDto {
    Long currentItemId;
    Long nextItemId;
    Long previousItemId;
}
