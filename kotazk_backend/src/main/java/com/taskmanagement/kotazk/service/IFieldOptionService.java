package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.FieldOption;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;

public interface IFieldOptionService {
    FieldOption createBuilderForNewField(FieldOptionRequestDto fieldOptionRequestDto);
}
