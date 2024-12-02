package com.taskmanagement.kotazk.config;

import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;

import java.util.*;

public class ConstantConfig {
    public static final String DEFAULT_ENDPOINT_BASIC_PART = "/api/v1";
    public static final String DEFAULT_ENDPOINT_PUBLIC_PART = DEFAULT_ENDPOINT_BASIC_PART + "/public";
    public static final String DEFAULT_ENDPOINT_SECURE_PART = DEFAULT_ENDPOINT_BASIC_PART + "/secure";
    public static final int DEFAULT_PAGE_NUM = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final boolean DEFAULT_SORT_DIRECTION_ASC = false;
    public static final long DEFAULT_POSITION_STEP = 1_000_000_000L;
    public static final EnumSet<WorkSpacePermission> DEFAULT_EDITOR_ROLE_PERMISSION = EnumSet.of(
            WorkSpacePermission.BROWSE_WORKSPACE,
            WorkSpacePermission.BROWSE_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.CREATE_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.MODIFY_OWN_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.DELETE_OWN_PROJECT // ADMIN, EDITOR
    );
    public static final EnumSet<WorkSpacePermission> DEFAULT_GUEST_ROLE_PERMISSION = EnumSet.of(
            WorkSpacePermission.BROWSE_WORKSPACE,
            WorkSpacePermission.BROWSE_PUBLIC_PROJECT // ADMIN, EDITOR, GUEST
    );


    public static final EnumSet<ProjectPermission> DEFAULT_PROJECT_ADMIN_PERMISSIONS = EnumSet.of(
            ProjectPermission.BROWSE_PROJECT,
            ProjectPermission.MODIFY_PROJECT,
            ProjectPermission.DELETE_PROJECT,
            ProjectPermission.MANAGE_ROLE,
            ProjectPermission.MANAGE_MEMBER,
            ProjectPermission.ASSIGN_TASKS,
            ProjectPermission.ASSIGNABLE_USER,
            ProjectPermission.CREATE_TASKS,
            ProjectPermission.DELETE_TASKS,
            ProjectPermission.EDIT_TASKS,
            ProjectPermission.LINK_TASKS,
            ProjectPermission.SCHEDULE_TASKS,
            ProjectPermission.MANAGE_STATUS,
            ProjectPermission.MANAGE_LABEL,
            ProjectPermission.MANAGE_TASK_TYPE,
            ProjectPermission.ADD_COMMENT,
            ProjectPermission.DELETE_ALL_COMMENT,
            ProjectPermission.DELETE_OWN_COMMENT,
            ProjectPermission.EDIT_ALL_COMMENT,
            ProjectPermission.EDIT_OWN_COMMENT,
            ProjectPermission.CREATE_ATTACHMENTS,
            ProjectPermission.DELETE_ALL_ATTACHMENTS,
            ProjectPermission.DELETE_OWN_ATTACHMENTS,
            ProjectPermission.MANAGE_REPORT
    );

    public static final EnumSet<ProjectPermission> DEFAULT_PROJECT_EDITOR_PERMISSIONS = EnumSet.of(
            ProjectPermission.BROWSE_PROJECT,
            ProjectPermission.ASSIGNABLE_USER,
            ProjectPermission.CREATE_TASKS,
            ProjectPermission.DELETE_TASKS,
            ProjectPermission.EDIT_TASKS,
            ProjectPermission.LINK_TASKS,
            ProjectPermission.SCHEDULE_TASKS,
            ProjectPermission.ADD_COMMENT,
            ProjectPermission.DELETE_OWN_COMMENT,
            ProjectPermission.EDIT_OWN_COMMENT,
            ProjectPermission.CREATE_ATTACHMENTS,
            ProjectPermission.DELETE_OWN_ATTACHMENTS
    );

    public static final EnumSet<ProjectPermission> DEFAULT_PROJECT_GUEST_PERMISSIONS = EnumSet.of(
            ProjectPermission.BROWSE_PROJECT
    );

}
