package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Field;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;

public interface IFieldService {
    Field createBuilderForNewTaskType(FieldRequestDto fieldRequestDto);
}
