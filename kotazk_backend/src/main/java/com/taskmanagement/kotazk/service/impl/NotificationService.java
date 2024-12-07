package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.notification.NotificationResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.repository.INotificationRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IUserRepository;
import com.taskmanagement.kotazk.service.INotificationService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService implements INotificationService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private INotificationRepository notificationRepository;
    @Autowired
    private final BasicSpecificationUtil<Notification> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public PageResponse<NotificationResponseDto> getPageByUser(SearchParamRequestDto searchParamRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Pageable pageable = PageRequest.of(
                searchParamRequestDto.getPageNum(),
                searchParamRequestDto.getPageSize(),
                Sort.by(searchParamRequestDto.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParamRequestDto.getSortBy() != null ? searchParamRequestDto.getSortBy() : "createdAt"));

        Specification<Notification> projectSpecification = (Root<Notification> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Notification, User> projectJoin = root.join("user");
            return criteriaBuilder.equal(projectJoin.get("id"), currentUser.getId());
        };

        Specification<Notification> filterSpecification = projectSpecification;


        Page<Notification> page = notificationRepository.findAll(filterSpecification, pageable);
        List<NotificationResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), NotificationResponseDto.class);
        return new PageResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Override
    public CustomResponse checkAll() {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Specification<Notification> projectSpecification = (Root<Notification> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Notification, User> projectJoin = root.join("user");
            return criteriaBuilder.equal(projectJoin.get("id"), currentUser.getId());
        };


        List<Notification> list = notificationRepository.findAll(projectSpecification);
        List<Notification> checkedList = list.stream().map(n -> {
            n.setIsCheck(true);
            return n;
        }).toList();

        notificationRepository.saveAll(checkedList);

        return new CustomResponse("All notification was checked", true);
    }

    @Override
    public CustomResponse setRead(Long notificationId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        notification.setIsRead(true);
        notificationRepository.save(notification);

        return new CustomResponse("Notification was read", true);
    }

    @Override
    public Notification createNotification(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        return savedNotification;
    }

    @Override
    public List<Notification> createNotifications(List<Notification> notifications) {
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        return savedNotifications;
    }
}
