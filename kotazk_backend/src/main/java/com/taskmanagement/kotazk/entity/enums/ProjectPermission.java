package com.taskmanagement.kotazk.entity.enums;

public enum ProjectPermission {
    // Quyền liên quan đến nhiệm vụ
    TASK_CREATE,       // Tạo nhiệm vụ
    TASK_EDIT,         // Chỉnh sửa nhiệm vụ
    TASK_DELETE,       // Xóa nhiệm vụ
    ASSIGN_TASK,       // Giao nhiệm vụ
    LOG_TIME,          // Theo dõi thời gian
    COMMENT,           // Bình luận
    CREATE_SUBTASK,    // Tạo công việc con
    ADD_ATTACHMENT,    // Thêm đính kèm
    EDIT_CUSTOM_FIELD, // Chỉnh sửa trường tùy chỉnh
    SET_DEPENDENCY,    // Đặt quan hệ phụ thuộc
    EDIT_TAG,          // Chỉnh sửa thẻ

    // Quyền liên quan đến quản lý thành viên
    ADD_MEMBER,        // Thêm thành viên
    REMOVE_MEMBER,     // Gỡ bỏ thành viên
    MANAGE_ROLES,      // Quản lý vai trò và quyền của thành viên

    // Quyền liên quan đến cấu hình và cài đặt
    MANAGE_SETTINGS,   // Quản lý cài đặt dự án
    MANAGE_WORKFLOWS,  // Quản lý quy trình công việc

    // Quyền liên quan đến bảng điều khiển và hiển thị
    CUSTOM_VIEWS,      // Tạo và chỉnh sửa các chế độ xem tùy chỉnh
    FILTERS,           // Sử dụng và chỉnh sửa bộ lọc
    SORTING,           // Sắp xếp nhiệm vụ

    // Quyền khác
    VIEW_ANALYTICS,    // Xem báo cáo phân tích
    EXPORT_DATA        // Xuất dữ liệu
}
