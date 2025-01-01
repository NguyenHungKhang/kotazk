export const projectPermissionList = [
  {
      group: 'Project Settings',
      items: [
          {
              key: 'BROWSE_PROJECT',
              title: 'Browse Project',
              description: 'Allows viewing the project\'s basic information and structure.'
          },
          {
              key: 'MANAGE_SECTION',
              title: 'Manage Sections',
              description: 'Grants permission to create, edit, and delete sections within the project.'
          },
          {
              key: 'MODIFY_PROJECT',
              title: 'Modify Project',
              description: 'Enables changes to project settings and configurations.'
          },
          {
              key: 'DELETE_PROJECT',
              title: 'Delete Project',
              description: 'Allows permanent deletion of the project.'
          }
      ]
  },
  {
      group: 'Role Permissions',
      items: [
          {
              key: 'MANAGE_ROLE',
              title: 'Manage Roles',
              description: 'Grants the ability to create, edit, and remove roles within the project.'
          }
      ]
  },
  {
      group: 'Member Permissions',
      items: [
          {
              key: 'MANAGE_MEMBER',
              title: 'Manage Members',
              description: 'Allows managing members in the project.'
          }
      ]
  },
  {
      group: 'Task Permissions',
      items: [
          {
              key: 'ASSIGN_TASKS',
              title: 'Assign Tasks',
              description: 'Enables assigning tasks to project members.'
          },
          {
              key: 'ASSIGNABLE_USER',
              title: 'Assignable User',
              description: 'Marks a user as eligible to be assigned tasks.'
          },
          {
              key: 'CREATE_TASKS',
              title: 'Create Tasks',
              description: 'Allows creating new tasks within the project.'
          },
          {
              key: 'DELETE_TASKS',
              title: 'Delete Tasks',
              description: 'Grants permission to permanently remove tasks.'
          },
          {
              key: 'EDIT_TASKS',
              title: 'Edit Tasks',
              description: 'Enables editing details of existing tasks.'
          },
          {
              key: 'SCHEDULE_TASKS',
              title: 'Schedule Tasks',
              description: 'Allows setting and adjusting task schedules.'
          }
      ]
  },
  {
      group: 'Field Permissions',
      items: [
          {
              key: 'MANAGE_STATUS',
              title: 'Manage Workflow',
              description: 'Grants control over the workflow, including status and transitions.'
          },
          {
              key: 'MANAGE_PRIORITY',
              title: 'Manage Priority',
              description: 'Allows setting and changing the priority levels of tasks.'
          },
          {
              key: 'MANAGE_LABEL',
              title: 'Manage Label',
              description: 'Permission to create, edit, and remove labels used for tasks.'
          },
          {
              key: 'MANAGE_TASK_TYPE',
              title: 'Manage Task Type',
              description: 'Grants permission to define and modify task types.'
          }
      ]
  },
  {
      group: 'Comment Permissions',
      items: [
          {
              key: 'ADD_COMMENT',
              title: 'Add Comment',
              description: 'Allows adding comments to tasks.'
          },
          {
              key: 'DELETE_ALL_COMMENT',
              title: 'Delete All Comments',
              description: 'Enables deletion of any comment in the project.'
          },
          {
              key: 'DELETE_OWN_COMMENT',
              title: 'Delete Own Comment',
              description: 'Allows users to delete their own comments.'
          },
          {
              key: 'EDIT_ALL_COMMENT',
              title: 'Edit All Comments',
              description: 'Grants the ability to edit any comment within the project.'
          },
          {
              key: 'EDIT_OWN_COMMENT',
              title: 'Edit Own Comment',
              description: 'Allows users to edit their own comments.'
          }
      ]
  },
  {
      group: 'Attachment Permissions',
      items: [
          {
              key: 'CREATE_ATTACHMENTS',
              title: 'Create Attachments',
              description: 'Permission to upload and attach files to tasks.'
          },
          {
              key: 'DELETE_ALL_ATTACHMENTS',
              title: 'Delete All Attachments',
              description: 'Allows deletion of any attachment in the project.'
          },
          {
              key: 'DELETE_OWN_ATTACHMENTS',
              title: 'Delete Own Attachments',
              description: 'Allows users to delete their own attachments.'
          }
      ]
  }
];
