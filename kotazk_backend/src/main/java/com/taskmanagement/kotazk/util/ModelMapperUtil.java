package com.taskmanagement.kotazk.util;

import org.hibernate.collection.spi.PersistentBag;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ModelMapperUtil {
    public static ModelMapper modelMapper;

    @Autowired
    public ModelMapperUtil(ModelMapper modelMapper) {
        ModelMapperUtil.modelMapper = modelMapper;
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
    }

    public static <T, S> S mapOne(T data, Class<S> type) {
        return modelMapper.map(data, type);
    }

    public static <D, T> List<D> mapList(List<T> typeList, Class<D> outClass) {
        return typeList.stream().map(entity -> mapOne(entity, outClass)).collect(Collectors.toList());
    }
}
