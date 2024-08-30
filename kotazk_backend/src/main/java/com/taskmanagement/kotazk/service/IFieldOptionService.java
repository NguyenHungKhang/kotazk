package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.FieldOption;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.field.FieldResponseDto;
import com.taskmanagement.kotazk.payload.response.fieldoption.FieldOptionResponseDto;

public interface IFieldOptionService {
    FieldOptionResponseDto create(FieldOptionRequestDto fieldOptionRequestDto);
    FieldOptionResponseDto update(Long id, FieldOptionRequestDto fieldOptionRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    FieldOptionResponseDto getOne(Long id);
    PageResponse<FieldOptionResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long fieldId);
}
