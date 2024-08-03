package com.taskmanagement.kotazk.specification;

import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;
import java.util.stream.Collectors;

public class WorkSpaceSpecification {

    public static Specification<WorkSpace> isOwnerOrMember(Long userId, boolean isAdmin) {
        return (Root<WorkSpace> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            if (isAdmin) {
                return criteriaBuilder.conjunction(); // No restrictions for admin
            } else {
                return criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("user").get("id"), userId),
                        criteriaBuilder.isTrue(root.join("members").get("user").get("id").in(userId))
                );
            }
        };
    }

    public static Specification<WorkSpace> filterByCriteria(FilterCriteriaRequestDto filter) {
        return (Root<WorkSpace> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Path<?> path = getPath(root, filter.getFilterKey());
            if (path == null) return null;
            return applyOperation(path, filter.getValue(), filter.getOperation(), criteriaBuilder);
        };
    }

    private static Path<?> getPath(Root<WorkSpace> root, String key) {
        return switch (key) {
            case "user" -> root.get("user").get("id");
            case "status" -> root.get("status");
            case "visibility" -> root.get("visibility");
            default -> null;
        };
    }

    private static Predicate applyOperation(Path<?> path, Object value, FilterOperator operation, CriteriaBuilder criteriaBuilder) {
        return switch (operation) {
            case EQUALS -> criteriaBuilder.equal(path, convertValue(value, path));
            case NOT_EQUALS -> criteriaBuilder.notEqual(path, convertValue(value, path));
            case IN -> path.in(parseCollection(value));
            case NOT_IN -> criteriaBuilder.not(path.in(parseCollection(value)));
            default -> null;
        };
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