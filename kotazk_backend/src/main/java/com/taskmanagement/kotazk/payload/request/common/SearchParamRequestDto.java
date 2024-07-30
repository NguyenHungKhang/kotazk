package com.taskmanagement.kotazk.payload.request.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SearchParamRequestDto {
    private List<FilterCriteriaRequestDto> filters; // Các điều kiện lọc
    private String sortBy; // Trường để sắp xếp
    private String sortDirection; // Hướng sắp xếp (asc/desc)
    private int pageNum; // Số trang hiện tại
    private int pageSize; // Kích thước trang
}