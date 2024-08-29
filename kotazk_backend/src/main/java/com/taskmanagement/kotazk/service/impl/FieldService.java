package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.Field;
import com.taskmanagement.kotazk.entity.enums.FieldType;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;
import com.taskmanagement.kotazk.service.IFieldService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Transactional
public class FieldService implements IFieldService {

    @Override
    public Field createBuilderForNewTaskType(FieldRequestDto fieldRequestDto) {
        Boolean isMultipleChoice = false;
        switch (fieldRequestDto.getType()) {
            case TEXT, TEXT_AREA:
                fieldRequestDto.setFieldOptions(null);
                break;
            case NUMBER:
                fieldRequestDto.setFieldOptions(null);
                Optional.ofNullable(fieldRequestDto.getDefaultValue())
                        .ifPresent(value -> {
                            try {
                                Double.parseDouble(value);
                            } catch (NumberFormatException e) {
                                throw new CustomException("Invalid number format!");
                            }
                        });
                break;
            case DATE:
                Optional.ofNullable(fieldRequestDto.getDefaultValue())
                        .ifPresent(value -> {
                            try {
                                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                                formatter.setLenient(false);
                                Timestamp timestamp = new Timestamp(formatter.parse(value).getTime());
                            } catch (ParseException e) {
                                throw new CustomException("Invalid timestamp format!");
                            }
                        });
                break;

            case SELECT:
                isMultipleChoice = true;

                break;
            case CHECKBOX:
                isMultipleChoice = true;
                break;
            default:
                throw new CustomException("Invalid input!");

        }
        return Field.builder()
                .name(fieldRequestDto.getName())
                .type(fieldRequestDto.getType())
                .description(fieldRequestDto.getDescription())
                .isRequired(fieldRequestDto.getIsRequired())
                .isMultipleChoice(isMultipleChoice)
                .isHideWhenEmpty(fieldRequestDto.getIsHideWhenEmpty())
                .build();
    }
}
