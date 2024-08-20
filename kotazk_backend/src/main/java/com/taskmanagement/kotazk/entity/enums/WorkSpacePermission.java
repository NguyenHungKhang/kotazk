package com.taskmanagement.kotazk.entity.enums;


public enum WorkSpacePermission {
    VIEW_WORKSPACE_INFO, // ADMIN, EDITOR, GUEST
    WORKSPACE_SETTING, // ADMIN
    VIEW_ROLE, // ADMIN, EDITOR, GUEST
    MANAGE_ROLE_SETTING, // ADMIN
    VIEW_MEMBER, // ADMIN, EDITOR, GUEST
    INVITE_MEMBER, // ADMIN
    REVOKE_MEMBER, // ADMIN
    CHANGE_MEMBER_ROLE, // ADMIN
    CHANGE_MEMBER_STATUS, // ADMIN
    VIEW_PROJECT_LIST, // ADMIN, EDITOR, GUEST
    BROWSE_PUBLIC_PROJECT, // ADMIN, EDITOR, GUEST
    BROWSE_PRIVATE_PROJECT, // ADMIN
    VIEW_PUBLIC_PROJECT_LIST, // ADMIN, EDITOR, GUEST
    VIEW_PRIVATE_PROJECT_LIST, // ADMIN
    VIEW_GOAL, // ADMIN, EDITOR, GUEST
    MANAGE_OWN_GOAL, // ADMIN, EDITOR
    MANAGE_ALL_GOAL, // ADMIN
    CREATE_PROJECT, // ADMIN, EDITOR
    MODIFY_OWN_PROJECT, // ADMIN, EDITOR
    MODIFY_ALL_PROJECT, // ADMIN
    DELETE_OWN_PROJECT, // ADMIN, EDITOR
    DELETE_ALL_PROJECT // ADMIN
}
