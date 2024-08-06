package com.taskmanagement.kotazk.specification;

import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;

import static org.springframework.data.jpa.domain.Specification.where;

public class WorkSpaceSpecification<T> {

    private Specification<T> createSpecification(FilterCriteriaRequestDto input) {
        return switch (input.getOperation()) {
            case EQUAL -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(input.getFilterKey()),
                            castToRequiredType(root.get(input.getFilterKey()).getJavaType(),
                                    input.getValue()));
            case NOT_EQUAL -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.notEqual(root.get(input.getFilterKey()),
                            castToRequiredType(root.get(input.getFilterKey()).getJavaType(),
                                    input.getValue()));
            case GREATER_THAN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.gt(root.get(input.getFilterKey()),
                            (Number) castToRequiredType(
                                    root.get(input.getFilterKey()).getJavaType(),
                                    input.getValue()));
            case LESS_THAN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.lt(root.get(input.getFilterKey()),
                            (Number) castToRequiredType(
                                    root.get(input.getFilterKey()).getJavaType(),
                                    input.getValue()));
            case LIKE -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get(input.getFilterKey()),
                            "%" + input.getValue() + "%");
            case IN -> (root, query, criteriaBuilder) ->
                    criteriaBuilder.in(root.get(input.getFilterKey()))
                            .value(castToRequiredType(
                                    root.get(input.getFilterKey()).getJavaType(),
                                    input.getValues()));
            default -> throw new RuntimeException("Operation not supported yet");
        };
    }

    private Object castToRequiredType(Class fieldType, String value) {
        if(fieldType.isAssignableFrom(Double.class)) {
            return Double.valueOf(value);
        } else if(fieldType.isAssignableFrom(Integer.class)) {
            return Integer.valueOf(value);
        } else if(Enum.class.isAssignableFrom(fieldType)) {
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

    private Specification<T> getSpecificationFromFilters(List<FilterCriteriaRequestDto> filters){
        Specification<T> specification = where(null);
        for (FilterCriteriaRequestDto filter : filters) {
            specification = specification.and(createSpecification(filter));
        }
        return specification;
    }
}