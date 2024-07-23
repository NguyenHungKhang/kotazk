package com.taskmanagement.kotazk.entity.enums;


public enum SpacePermission {
    // Quyền liên quan đến quản lý không gian làm việc (space)
    EDIT_SPACE,         // Chỉnh sửa thông tin không gian làm việc
    DELETE_SPACE,       // Xóa không gian làm việc
    MANAGE_SETTINGS,    // Quản lý cài đặt không gian làm việc

    // Quyền liên quan đến quản lý dự án trong không gian làm việc
    EDIT_PROJECT,       // Chỉnh sửa thông tin dự án trong không gian làm việc
    DELETE_PROJECT,     // Xóa dự án khỏi không gian làm việc
    MANAGE_PROJECTS,    // Quản lý tất cả các dự án trong không gian làm việc
    VIEW_PROJECTS,      // Xem tất cả các dự án trong không gian làm việc
    ARCHIVE_PROJECTS,   // Lưu trữ dự án trong không gian làm việc

    // Quyền liên quan đến quản lý thành viên trong không gian làm việc
    ADD_MEMBER,         // Thêm thành viên vào không gian làm việc
    REMOVE_MEMBER,      // Gỡ bỏ thành viên khỏi không gian làm việc
    MANAGE_SPACE_ROLES, // Quản lý vai trò và quyền trong không gian làm việc

    // Quyền khác
    VIEW_SPACE_ANALYTICS, // Xem báo cáo phân tích của không gian làm việc
    EXPORT_SPACE_DATA     // Xuất dữ liệu của không gian làm việc
}
