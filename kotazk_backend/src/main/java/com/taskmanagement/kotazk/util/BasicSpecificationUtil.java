package com.taskmanagement.kotazk.util;

import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
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
            if (Boolean.TRUE.equals(input.getSpecificTimestampFilter())) {
                // Handle specific timestamp filter
                return handleSpecificTimestampFilter(input, root, criteriaBuilder);
            }
            Path<?> finalPath = getPathForKey(root, input.getKey());

            switch (input.getOperation()) {
                case EQUAL:
                    return criteriaBuilder.equal(finalPath,
                            castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case NOT_EQUAL:
                    return criteriaBuilder.notEqual(finalPath,
                            castToRequiredType(finalPath.getJavaType(), input.getValue()));

                case GREATER_THAN:
                    if (Comparable.class.isAssignableFrom(finalPath.getJavaType())) {
                        return criteriaBuilder.greaterThan((Path<Comparable>) finalPath,
                                (Comparable) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    } else {
                        return criteriaBuilder.gt((Path<Number>) finalPath,
                                (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    }

                case LESS_THAN:
                    if (Comparable.class.isAssignableFrom(finalPath.getJavaType())) {
                        return criteriaBuilder.lessThan((Path<Comparable>) finalPath,
                                (Comparable) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    } else {
                        return criteriaBuilder.lt((Path<Number>) finalPath,
                                (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    }

                case GREATER_THAN_OR_EQUAL:
                    if (Comparable.class.isAssignableFrom(finalPath.getJavaType())) {
                        return criteriaBuilder.greaterThanOrEqualTo((Path<Comparable>) finalPath,
                                (Comparable) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    } else {
                        return criteriaBuilder.ge((Path<Number>) finalPath,
                                (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    }

                case LESS_THAN_OR_EQUAL:
                    if (Comparable.class.isAssignableFrom(finalPath.getJavaType())) {
                        return criteriaBuilder.lessThanOrEqualTo((Path<Comparable>) finalPath,
                                (Comparable) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    } else {
                        return criteriaBuilder.le((Path<Number>) finalPath,
                                (Number) castToRequiredType(finalPath.getJavaType(), input.getValue()));
                    }
                case LIKE:
                    return criteriaBuilder.like((Path<String>) finalPath,
                            "%" + input.getValue() + "%");

                case IN: {
                    CriteriaBuilder.In<Object> inClause = criteriaBuilder.in(finalPath);
                    List<?> values = (List<?>) castToRequiredType(finalPath.getJavaType(), input.getValues());

                    boolean containsZero = false;
                    for (Object value : values) {
                        if (value.equals(0L) || value.equals(0) || value.equals("0")) {
                            System.out.println(1);
                            containsZero = true;
                        } else {
                            inClause.value(value);
                        }
                    }
                    if (containsZero) {
                        return criteriaBuilder.or(
                                inClause,
                                criteriaBuilder.isNull(finalPath)
                        );
                    }

                    return inClause; // Return the IN clause if 0 is not present
                }
                case NOT_IN: {
                    CriteriaBuilder.In<Object> inClause = criteriaBuilder.in(finalPath);
                    List<?> values = (List<?>) castToRequiredType(finalPath.getJavaType(), input.getValues());
                    for (Object value : values) {
                        inClause.value(value);
                    }
                    return criteriaBuilder.not(inClause);
                }
                case IS_NULL:
                    return criteriaBuilder.isNull(finalPath);

                case IS_NOT_NULL:
                    return criteriaBuilder.isNotNull(finalPath);
                case BETWEEN:
                    List<String> betweenValues = input.getValues();
                    if (betweenValues.size() != 2) {
                        throw new IllegalArgumentException("BETWEEN operation requires exactly two values.");
                    }

                    // Cast the values to the correct type based on the finalPath's type
                    Object startValue = castToRequiredType(finalPath.getJavaType(), betweenValues.get(0));
                    Object endValue = castToRequiredType(finalPath.getJavaType(), betweenValues.get(1));

                    // Check if the path is of a Comparable type and use the appropriate between method
                    if (Comparable.class.isAssignableFrom(finalPath.getJavaType())) {
                        return criteriaBuilder.between((Path<Comparable>) finalPath, (Comparable) startValue, (Comparable) endValue);
                    } else {
                        // If it's a numeric path (like Integer, Long, etc.), treat it as Comparable
                        return criteriaBuilder.between((Path<Comparable>) finalPath, (Comparable) startValue, (Comparable) endValue);
                    }

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

    private Predicate handleSpecificTimestampFilter(FilterCriteriaRequestDto input, Root<T> root, CriteriaBuilder criteriaBuilder) {
        Path<?> startPath = root.get("startAt");
        Path<?> endPath = root.get("endAt");

        List<String> timestamps = input.getValues();
        if (timestamps == null || timestamps.isEmpty()) {
            throw new IllegalArgumentException("Timestamp values are required for specificTimestampFilter.");
        }

        List<Predicate> predicates = new ArrayList<>();

        Object firstTimestamp = castToRequiredType(startPath.getJavaType(), timestamps.get(0));

        boolean hasStartAt = root.getModel().getAttributes().contains("startAt");
        boolean hasEndAt = root.getModel().getAttributes().contains("endAt");

        if (Boolean.TRUE.equals(input.getSpecificTimestampFilterNotNull())) {
            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.isNotNull(startPath),
                    criteriaBuilder.isNotNull(endPath)
            ));
        } else if (!hasStartAt && !hasEndAt) {
            return criteriaBuilder.conjunction(); // No filtering if both fields are missing
        }

        if (timestamps.size() == 1) {
            predicates.add(
                    criteriaBuilder.and(
                            criteriaBuilder.and(
                                    criteriaBuilder.lessThanOrEqualTo((Path<Comparable>) startPath, (Comparable) firstTimestamp),
                                    criteriaBuilder.isNotNull(startPath)
                            ),
                            criteriaBuilder.and(
                                    criteriaBuilder.greaterThanOrEqualTo((Path<Comparable>) endPath, (Comparable) firstTimestamp),
                                    criteriaBuilder.isNotNull(endPath) // Include records where endAt is null
                            )
                    )
            );
        } else if (timestamps.size() == 2) {
            Object filterStart = castToRequiredType(startPath.getJavaType(), timestamps.get(0));
            Object filterEnd = castToRequiredType(endPath.getJavaType(), timestamps.get(1));

            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.and(
                            criteriaBuilder.lessThanOrEqualTo((Path<Comparable>) startPath, (Comparable) firstTimestamp),
                            criteriaBuilder.isNotNull(startPath)
                    ),
                    criteriaBuilder.and(
                            criteriaBuilder.greaterThanOrEqualTo((Path<Comparable>) endPath, (Comparable) filterEnd),
                            criteriaBuilder.isNotNull(endPath) // Include records where endAt is null

                    ),
                    criteriaBuilder.and(
                            criteriaBuilder.lessThanOrEqualTo((Path<Comparable>) startPath, (Comparable) filterStart),
                            criteriaBuilder.greaterThanOrEqualTo((Path<Comparable>) endPath, (Comparable) filterEnd)
                    )
            ));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }


}