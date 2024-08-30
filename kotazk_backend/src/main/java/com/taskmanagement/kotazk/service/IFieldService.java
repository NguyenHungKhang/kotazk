package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Field;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.field.FieldResponseDto;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;

public interface IFieldService {
    FieldResponseDto create(FieldRequestDto fieldRequestDto);
    FieldResponseDto update(Long id, FieldRequestDto fieldRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);

    FieldResponseDto getOne(Long id);
    PageResponse<FieldResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId);
}
