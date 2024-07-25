package com.taskmanagement.kotazk.entity.enums;

public enum ProjectPermission {

    // Status Permissions
    VIEW_STATUS,                  // Ability to view status
    CREATE_STATUS,                // Ability to create new statuses
    EDIT_STATUS,                  // Ability to edit statuses
    DELETE_STATUS,                // Ability to delete statuses

    // Task Permissions
    VIEW_TASKS,                   // Ability to view tasks
    CREATE_TASK,                  // Ability to create new tasks
    EDIT_TASK,                    // Ability to edit tasks
    DELETE_TASK,                  // Ability to delete tasks
    MANAGE_TASK_ASSIGNMENTS,      // Ability to manage task assignments
    MANAGE_TASK_LABELS,           // Ability to manage labels on tasks
    ADD_TASK_COMMENTS,            // Ability to add comments on tasks
    DELETE_TASK_COMMENTS,         // Ability to delete comments on tasks
    MANAGE_TASK_ATTACHMENTS,      // Ability to manage attachments on tasks
    MANAGE_TASK_CUSTOM_FIELDS,    // Ability to manage custom fields on tasks

    // Workflow Permissions
    VIEW_WORKFLOWS,               // Ability to view workflows
    CREATE_WORKFLOW,              // Ability to create new workflows
    EDIT_WORKFLOW,                // Ability to edit workflows
    DELETE_WORKFLOW,              // Ability to delete workflows

    // View Permissions
    VIEW_VIEWS,                   // Ability to view views
    CREATE_VIEW,                  // Ability to create new views
    EDIT_VIEW,                    // Ability to edit views
    DELETE_VIEW,                  // Ability to delete views

    // Member Permissions
    VIEW_MEMBERS,                 // Ability to view members
    INVITE_MEMBERS,               // Ability to invite new members
    REMOVE_MEMBERS,               // Ability to remove members
    EDIT_MEMBER_ROLES,            // Ability to edit member roles
}
