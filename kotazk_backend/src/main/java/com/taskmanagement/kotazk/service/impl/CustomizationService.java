package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.service.ICustomizationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomizationService implements ICustomizationService {
    @Override
    public Customization createBuilder(CustomizationRequestDto customizationRequestDto) {
        return Customization.builder()
                .fontColor(customizationRequestDto.getFontColor())
                .backgroundColor(customizationRequestDto.getBackgroundColor())
                .avatar(customizationRequestDto.getAvatar())
                .icon(customizationRequestDto.getIcon())
                .build();
    }
}
