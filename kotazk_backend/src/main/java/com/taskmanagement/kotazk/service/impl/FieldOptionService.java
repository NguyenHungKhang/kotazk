package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.FieldOption;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;
import com.taskmanagement.kotazk.service.IFieldOptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FieldOptionService implements IFieldOptionService {
    @Override
    public FieldOption createBuilderForNewField(FieldOptionRequestDto fieldOptionRequestDto) {
        return null;
    }
}
