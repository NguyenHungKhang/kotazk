package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.Setting;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkSpaceService implements IWorkSpaceService {

    @Autowired
    private IWorkSpaceRepository workSpaceRepository;

    @Override
    public WorkSpaceDetailResponseDto create(WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace newWorkSpace = ModelMapperUtil.mapOne(workSpace, WorkSpace.class);
        newWorkSpace.setUser(currentUser);

        // Chuyển đổi danh sách settings từ WorkSpaceRequestDto sang WorkSpace
        Set<Setting> settings = workSpace.getSettings().stream()
                .map(dto -> {
                    Setting setting = new Setting();
                    setting.setKey(dto.getKey());
                    setting.setValue(dto.getValue());
                    return setting;
                })
                .collect(Collectors.toSet());

        newWorkSpace.setSettings(settings);

        // Lưu WorkSpace vào database
         workSpaceRepository.save(newWorkSpace);

        return ModelMapperUtil.mapOne(newWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace) {
        return null;
    }

    @Override
    public Boolean delete(Long id) {
        return null;
    }

    @Override
    public Boolean softDelete(Long id) {
        return null;
    }

    @Override
    public Boolean archived(Long id) {
        return null;
    }

    @Override
    public Boolean restore(Long id) {
        return null;
    }

    @Override
    public WorkSpaceDetailResponseDto getDetail(Long id) {
        return null;
    }

    @Override
    public WorkSpaceSummaryResponseDto getSummary(Long id) {
        return null;
    }

    @Override
    public PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(Long pageNum, Long pageSize) {
        return null;
    }

    @Override
    public PageResponse<WorkSpaceDetailResponseDto> getDetailList(Long pageNum, Long pageSize) {
        return null;
    }
}
