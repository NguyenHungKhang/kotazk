package com.taskmanagement.kotazk.config;

import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

public class ConstantConfig {
    public static final int DEFAULT_PAGE_NUM = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final boolean DEFAULT_SORT_DIRECTION_ASC = false;
    public static final Set<WorkSpacePermission> DEFAULT_EDITOR_ROLE_PERMISSION = Set.of(
            WorkSpacePermission.VIEW_WORKSPACE_INFO, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_ROLE, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_MEMBER, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_GOAL, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.MANAGE_OWN_GOAL, // ADMIN, EDITOR
            WorkSpacePermission.CREATE_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.MODIFY_OWN_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.DELETE_OWN_PROJECT // ADMIN, EDITOR
    );
    public static final Set<WorkSpacePermission> DEFAULT_GUEST_ROLE_PERMISSION = Set.of(
            WorkSpacePermission.VIEW_WORKSPACE_INFO, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_ROLE, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_MEMBER, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_GOAL // ADMIN, EDITOR, GUEST
    );
}
