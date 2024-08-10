package com.taskmanagement.kotazk.util;

import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.*;

import static org.springframework.data.jpa.domain.Specification.where;

@Component
public class BasicSpecificationUtil<T> {

    private Specification<T> createSpecification(FilterCriteriaRequestDto input) {
        return switch (input.getOperation()) {
            case EQUAL -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(input.getKey()),
                            castToRequiredType(root.get(input.getKey()).getJavaType(),
                                    input.getValue()));
            case NOT_EQUAL -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.notEqual(root.get(input.getKey()),
                            castToRequiredType(root.get(input.getKey()).getJavaType(),
                                    input.getValue()));
            case GREATER_THAN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.gt(root.get(input.getKey()),
                            (Number) castToRequiredType(
                                    root.get(input.getKey()).getJavaType(),
                                    input.getValue()));
            case LESS_THAN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.lt(root.get(input.getKey()),
                            (Number) castToRequiredType(
                                    root.get(input.getKey()).getJavaType(),
                                    input.getValue()));
            case LIKE -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get(input.getKey()),
                            "%" + input.getValue() + "%");
            case IN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.in(root.get(input.getKey()))
                            .value(castToRequiredType(
                                    root.get(input.getKey()).getJavaType(),
                                    input.getValues()));
            default -> throw new RuntimeException("Operation not supported yet");
        };
    }

    private Object castToRequiredType(Class fieldType, String value) {
        if(fieldType.isAssignableFrom(Double.class)) {
            return Double.valueOf(value);
        } else if(fieldType.isAssignableFrom(Integer.class)) {
            return Integer.valueOf(value);
        } else if(fieldType.isAssignableFrom(Long.class)) {
            return Long.valueOf(value);
        } else if(fieldType.isAssignableFrom(Timestamp.class)) {
            return Timestamp.valueOf(value);
        }
        else if(Enum.class.isAssignableFrom(fieldType)) {
            return Enum.valueOf(fieldType, value);
        }
        return null;
    }

    private Object castToRequiredType(Class fieldType, List<String> values) {
        List<Object> lists = new ArrayList<>();
        for (String value : values) {
            lists.add(castToRequiredType(fieldType, value));
        }
        return lists;
    }

    public Specification<T> getSpecificationFromFilters(List<FilterCriteriaRequestDto> filters){
        Specification<T> specification = where(null);
        for (FilterCriteriaRequestDto filter : filters) {
            specification = specification.and(createSpecification(filter));
        }
        return specification;
    }
}