export const workspacePermissionList = [
    {
        group: 'Workspace Settings',
        items: [
            {
                key: 'BROWSE_WORKSPACE',
                title: 'Browse Workspace',
                description: 'Allows viewing the workspace and its contents.'
            },
            {
                key: 'WORKSPACE_SETTING',
                title: 'Workspace Setting',
                description: 'Grants access to modify workspace settings.'
            },
            {
                key: 'MANAGE_ROLE',
                title: 'Manage Roles',
                description: 'Allows managing roles within the workspace.'
            },
            {
                key: 'MANAGE_MEMBER',
                title: 'Manage Members',
                description: 'Grants the ability to manage members in the workspace.'
            },
            {
                key: 'RE_POSITION_PROJECT',
                title: 'Reposition Projects',
                description: 'Allows changing the order of projects within the workspace.'
            }
        ]
    },
    {
        group: 'Project Permissions',
        items: [
            {
                key: 'BROWSE_PUBLIC_PROJECT',
                title: 'Browse Public Projects',
                description: 'Allows viewing public projects in the workspace.'
            },
            {
                key: 'BROWSE_PRIVATE_PROJECT',
                title: 'Browse Private Projects',
                description: 'Grants access to view private projects in the workspace.'
            },
            {
                key: 'CREATE_PROJECT',
                title: 'Create Project',
                description: 'Allows creating new projects within the workspace.'
            },
            {
                key: 'MODIFY_OWN_PROJECT',
                title: 'Modify Own Projects',
                description: 'Grants permission to edit projects created by the user.'
            },
            {
                key: 'MODIFY_ALL_PROJECT',
                title: 'Modify All Projects',
                description: 'Enables editing any project within the workspace.'
            },
            {
                key: 'DELETE_OWN_PROJECT',
                title: 'Delete Own Projects',
                description: 'Allows deleting projects created by the user.'
            },
            {
                key: 'DELETE_ALL_PROJECT',
                title: 'Delete All Projects',
                description: 'Grants permission to delete any project within the workspace.'
            }
        ]
    }
];
