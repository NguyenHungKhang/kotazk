package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Label;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.label.LabelRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;

import java.util.List;

public interface ILabelService {
    LabelResponseDto create(LabelRequestDto labelRequestDto);
    LabelResponseDto update(Long id, LabelRequestDto labelRequestDto);
    List<LabelResponseDto> saveList(List<LabelRequestDto> labelRequestDtos, Long projectId);
    List<Long>  delete(Long id);
    Boolean softDelete(Long id);
    LabelResponseDto getOne(Long id);
    PageResponse<LabelResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId);
}
