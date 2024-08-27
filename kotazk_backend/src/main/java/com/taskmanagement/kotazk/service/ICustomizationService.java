package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;

public interface ICustomizationService {
    Customization createBuilder(CustomizationRequestDto customizationRequestDto);
}
