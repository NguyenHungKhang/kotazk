package com.taskmanagement.kotazk.util;

import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.*;

import static org.springframework.data.jpa.domain.Specification.where;

@Component
public class BasicSpecificationUtil<T> {

    public Specification<T> createSpecification(FilterCriteriaRequestDto input) {
        return (root, query, criteriaBuilder) -> {
            Path<?> finalPath = getPathForKey(root, input.getKey());

            switch (input.getOperation()) {
                case EQUAL:
                    return criteriaBuilder.equal(finalPath,
                            castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case NOT_EQUAL:
                    return criteriaBuilder.notEqual(finalPath,
                            castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case GREATER_THAN:
                    return criteriaBuilder.gt((Path<Number>) finalPath,
                            (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case LESS_THAN:
                    return criteriaBuilder.lt((Path<Number>) finalPath,
                            (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case GREATER_THAN_OR_EQUAL:
                    return criteriaBuilder.ge((Path<Number>) finalPath,
                            (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case LESS_THAN_OR_EQUAL:
                    return criteriaBuilder.le((Path<Number>) finalPath,
                            (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case LIKE:
                    return criteriaBuilder.like((Path<String>) finalPath,
                            "%" + input.getValue() + "%");

                case IN: {
                    CriteriaBuilder.In<Object> inClause = criteriaBuilder.in(finalPath);
                    List<?> values = (List<?>) castToRequiredType(finalPath.getJavaType(), input.getValues());
                    for (Object value : values) {
                        inClause.value(value);
                    }
                    return inClause;
                }
                case IS_NULL:
                    return criteriaBuilder.isNull(finalPath);

                case IS_NOT_NULL:
                    return criteriaBuilder.isNotNull(finalPath);

                default:
                    throw new RuntimeException("Operation not supported yet");
            }
        };
    }

    // Hàm hỗ trợ để lấy Path<?> cho các thuộc tính liên kết
    private Path<?> getPathForKey(Root<T> root, String key) {
        String[] parts = key.split("\\.");
        Path<?> path = root;

        // Duyệt qua các phần của thuộc tính liên kết
        for (String part : parts) {
            path = path.get(part);
        }

        return path;
    }

    // Hàm hỗ trợ để chuyển đổi giá trị thành kiểu dữ liệu tương ứng
    public static Object castToRequiredType(Class<?> type, String value) {
        if (type.equals(String.class)) {
            return value;
        } else if (type.equals(Integer.class)) {
            return Integer.parseInt(value);
        } else if (type.equals(Long.class)) {
            return Long.parseLong(value);
        } else if (type.equals(Double.class)) {
            return Double.parseDouble(value);
        } else if (type.equals(Boolean.class)) {
            return Boolean.parseBoolean(value);
        } else if (type.equals(Timestamp.class)) {
            return new Timestamp(Long.parseLong(value));
        } else if (type.isEnum()) {
            try {
                @SuppressWarnings("unchecked")
                Class<Enum> enumType = (Class<Enum>) type;
                return Enum.valueOf(enumType, value);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid value for enum " + type.getSimpleName() + ": " + value, e);
            }
        }
        throw new IllegalArgumentException("Unsupported type: " + type);
    }

    private Object castToRequiredType(Class fieldType, List<String> values) {
        List<Object> lists = new ArrayList<>();
        for (String value : values) {
            lists.add(castToRequiredType(fieldType, value));
        }
        return lists;
    }

    public Specification<T> getSpecificationFromFilters(List<FilterCriteriaRequestDto> filters) {
        Specification<T> specification = where(null);
        for (FilterCriteriaRequestDto filter : filters) {
            specification = specification.and(createSpecification(filter));
        }
        return specification;
    }
}