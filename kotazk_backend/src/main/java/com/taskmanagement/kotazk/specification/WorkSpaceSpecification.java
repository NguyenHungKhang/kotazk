package com.taskmanagement.kotazk.specification;


import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.SearchOperation;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class WorkSpaceSpecification implements Specification<WorkSpace> {

    private final SearchCriteria criteria;

    public WorkSpaceSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<WorkSpace> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (criteria == null || criteria.getFilterKey() == null || criteria.getOperation() == null) {
            return null;
        }

        Path<?> path = root.get(criteria.getFilterKey());

        if (path == null) {
            return null;
        }

        return switch (SearchOperation.getSimpleOperation(criteria.getOperation())) {
            case CONTAINS ->
                    cb.like(cb.lower(path.as(String.class)), "%" + criteria.getValue().toString().toLowerCase() + "%");
            case DOES_NOT_CONTAIN ->
                    cb.notLike(cb.lower(path.as(String.class)), "%" + criteria.getValue().toString().toLowerCase() + "%");
            case EQUAL -> cb.equal(path, criteria.getValue());
            case NOT_EQUAL -> cb.notEqual(path, criteria.getValue());
            case BEGINS_WITH ->
                    cb.like(cb.lower(path.as(String.class)), criteria.getValue().toString().toLowerCase() + "%");
            case DOES_NOT_BEGIN_WITH ->
                    cb.notLike(cb.lower(path.as(String.class)), criteria.getValue().toString().toLowerCase() + "%");
            case ENDS_WITH ->
                    cb.like(cb.lower(path.as(String.class)), "%" + criteria.getValue().toString().toLowerCase());
            case DOES_NOT_END_WITH ->
                    cb.notLike(cb.lower(path.as(String.class)), "%" + criteria.getValue().toString().toLowerCase());
            case NUL -> cb.isNull(path);
            case NOT_NULL -> cb.isNotNull(path);
            case GREATER_THAN -> cb.greaterThan(path.as(Comparable.class), (Comparable) criteria.getValue());
            case GREATER_THAN_EQUAL ->
                    cb.greaterThanOrEqualTo(path.as(Comparable.class), (Comparable) criteria.getValue());
            case LESS_THAN -> cb.lessThan(path.as(Comparable.class), (Comparable) criteria.getValue());
            case LESS_THAN_EQUAL -> cb.lessThanOrEqualTo(path.as(Comparable.class), (Comparable) criteria.getValue());
            case ANY -> path.in((List<?>) criteria.getValue());
            case ALL ->
                // Implement logic for "ALL" if needed
                    null;
            default -> null;
        };
    }
}