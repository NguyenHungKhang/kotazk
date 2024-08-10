package com.taskmanagement.kotazk.payload.request.common;

import com.taskmanagement.kotazk.config.ConstantConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SearchParamRequestDto {
    private List<FilterCriteriaRequestDto> filters; // Các điều kiện lọc
    private String sortBy = DEFAULT_SORT_BY; // Trường để sắp xếp
    private Boolean sortDirectionAsc = DEFAULT_SORT_DIRECTION_ASC; // Hướng sắp xếp (asc/desc)
    private int pageNum = DEFAULT_PAGE_NUM; // Số trang hiện tại
    private int pageSize = DEFAULT_PAGE_SIZE; // Kích thước trang
}