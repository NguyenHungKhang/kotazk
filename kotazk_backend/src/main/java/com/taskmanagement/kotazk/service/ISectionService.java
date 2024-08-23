package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Section;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.section.SectionRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.section.SectionResponseDto;

import java.util.List;

public interface ISectionService {
    List<Section> initialSection();
    SectionResponseDto create(SectionRequestDto sectionRequestDto);
    SectionResponseDto update(Long id, SectionRequestDto sectionRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    SectionResponseDto getOne(Long id);
    PageResponse<SectionResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId);
}
