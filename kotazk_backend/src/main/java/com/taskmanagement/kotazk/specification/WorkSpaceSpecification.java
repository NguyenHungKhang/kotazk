package com.taskmanagement.kotazk.specification;

import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;
import java.util.stream.Collectors;

public class WorkSpaceSpecification {

    public static Specification<WorkSpace> filterByCriteria(FilterCriteriaRequestDto filter) {
        return (Root<WorkSpace> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Path<?> path = getPath(root, filter.getFilterKey());
            if (path == null) return null;

            return applyOperation(path, filter.getValue(), filter.getOperation(), criteriaBuilder);
        };
    }

    private static Path<?> getPath(Root<WorkSpace> root, String key) {
        switch (key) {
            case "user": return root.get("user").get("id");
            case "status": return root.get("status");
            case "visibility": return root.get("visibility");
            default: return null;
        }
    }

    private static Predicate applyOperation(Path<?> path, Object value, FilterOperator operation, CriteriaBuilder criteriaBuilder) {
        switch (operation) {
            case EQUALS:
                return criteriaBuilder.equal(path, convertValue(value, path));
            case NOT_EQUALS:
                return criteriaBuilder.notEqual(path, convertValue(value, path));
            case IN:
                return path.in(parseCollection(value));
            case NOT_IN:
                return criteriaBuilder.not(path.in(parseCollection(value)));
            default:
                return null;
        }
    }

    private static Object convertValue(Object value, Path<?> path) {
        if (path.getJavaType().isEnum()) {
            return Enum.valueOf((Class<Enum>) path.getJavaType(), (String) value);
        }
        return value;
    }

    private static Collection<?> parseCollection(Object value) {
        if (value instanceof String) {
            return Arrays.asList(((String) value).split(","));
        }
        return (Collection<?>) value;
    }
}