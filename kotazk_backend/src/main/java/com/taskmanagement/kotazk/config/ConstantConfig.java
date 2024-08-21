package com.taskmanagement.kotazk.config;

import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;

import java.util.*;

public class ConstantConfig {
    public static final int DEFAULT_PAGE_NUM = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final boolean DEFAULT_SORT_DIRECTION_ASC = false;
    public static final EnumSet<WorkSpacePermission> DEFAULT_EDITOR_ROLE_PERMISSION = EnumSet.of(
            WorkSpacePermission.VIEW_WORKSPACE_INFO, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_ROLE, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_MEMBER, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PUBLIC_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.BROWSE_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_GOAL, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.MANAGE_OWN_GOAL, // ADMIN, EDITOR
            WorkSpacePermission.CREATE_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.MODIFY_OWN_PROJECT, // ADMIN, EDITOR
            WorkSpacePermission.DELETE_OWN_PROJECT // ADMIN, EDITOR
    );
    public static final EnumSet<WorkSpacePermission> DEFAULT_GUEST_ROLE_PERMISSION = EnumSet.of(
            WorkSpacePermission.VIEW_WORKSPACE_INFO, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_ROLE, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_MEMBER, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_PUBLIC_PROJECT_LIST, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.BROWSE_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
            WorkSpacePermission.VIEW_GOAL // ADMIN, EDITOR, GUEST
    );


    public static final EnumSet<ProjectPermission> DEFAULT_PROJECT_ADMIN_PERMISSIONS = EnumSet.of(
            ProjectPermission.BROWSE_PROJECT,
            ProjectPermission.MODIFY_PROJECT,
            ProjectPermission.DELETE_PROJECT,
            ProjectPermission.MANAGE_ROLE,
            ProjectPermission.INVITE_MEMBER,
            ProjectPermission.REVOKE_MEMBER,
            ProjectPermission.DELETE_MEMBER,
            ProjectPermission.CHANGE_MEMBER_ROLE,
            ProjectPermission.CHANGE_MEMBER_STATUS,
            ProjectPermission.MANAGE_SPRINTS,
            ProjectPermission.START_COMPLETE_SPRINTS,
            ProjectPermission.EDIT_SPRINTS,
            ProjectPermission.ASSIGN_TASKS,
            ProjectPermission.ASSIGNABLE_USER,
            ProjectPermission.CLOSE_TASKS,
            ProjectPermission.CREATE_TASKS,
            ProjectPermission.DELETE_TASKS,
            ProjectPermission.EDIT_TASKS,
            ProjectPermission.LINK_TASKS,
            ProjectPermission.MOVE_TASKS,
            ProjectPermission.SCHEDULE_TASKS,
            ProjectPermission.MANAGE_WORKFLOW,
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
            ProjectPermission.ARCHIVE_TASK_FOR_PROJECT,
            ProjectPermission.RESTORE_TASK_FOR_PROJECT,
            ProjectPermission.BROWSE_ARCHIVE
    );

    public static final EnumSet<ProjectPermission> DEFAULT_PROJECT_EDITOR_PERMISSIONS = EnumSet.of(
            ProjectPermission.BROWSE_PROJECT,
            ProjectPermission.ASSIGNABLE_USER,
            ProjectPermission.CLOSE_TASKS,
            ProjectPermission.CREATE_TASKS,
            ProjectPermission.DELETE_TASKS,
            ProjectPermission.EDIT_TASKS,
            ProjectPermission.LINK_TASKS,
            ProjectPermission.MOVE_TASKS,
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
