package com.taskmanagement.kotazk.entity.enums;

public enum ProjectPermission {
    BROWSE_PROJECT, // ADMIN, EDITOR, GUEST
    MODIFY_PROJECT, // ADMIN
    DELETE_PROJECT, // ADMIN
    MANAGE_ROLE, // ADMIN
    INVITE_MEMBER, // ADMIN
    REVOKE_MEMBER, // ADMIN
    DELETE_MEMBER, // ADMIN
    CHANGE_MEMBER_ROLE, // ADMIN
    CHANGE_MEMBER_STATUS, // ADMIN
    MANAGE_SPRINTS, // ADMIN
    START_COMPLETE_SPRINTS, // ADMIN
    EDIT_SPRINTS, // ADMIN
    ASSIGN_TASKS, // ADMIN
    ASSIGNABLE_USER, // ADMIN, EDITOR
    CLOSE_TASKS, // ADMIN, EDITOR
    CREATE_TASKS, // ADMIN, EDITOR
    DELETE_TASKS, // ADMIN, EDITOR
    EDIT_TASKS, // ADMIN, EDITOR
    LINK_TASKS, // ADMIN, EDITOR
    MOVE_TASKS, // ADMIN, EDITOR
    SCHEDULE_TASKS, // ADMIN, EDITOR
    MANAGE_WORKFLOW, // ADMIN
    MANAGE_LABEL, // ADMIN
    MANAGE_TASK_TYPE, // ADMIN
    ADD_COMMENT, // ADMIN, EDITOR
    DELETE_ALL_COMMENT, // ADMIN
    DELETE_OWN_COMMENT, // ADMIN, EDITOR
    EDIT_ALL_COMMENT, // ADMIN
    EDIT_OWN_COMMENT, // ADMIN, EDITOR
    CREATE_ATTACHMENTS, // ADMIN, EDITOR
    DELETE_ALL_ATTACHMENTS, // ADMIN
    DELETE_OWN_ATTACHMENTS, // ADMIN, EDITOR
    ARCHIVE_TASK_FOR_PROJECT, // ADMIN
    RESTORE_TASK_FOR_PROJECT, // ADMIN
    BROWSE_ARCHIVE, // ADMIN
}
