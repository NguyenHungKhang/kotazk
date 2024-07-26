package com.taskmanagement.kotazk.entity.enums;

public enum FilterOperator {
    EQUALS, // Bằng
    NOT_EQUALS, // Khác
    GREATER_THAN, // Lớn hơn
    GREATER_THAN_OR_EQUAL, // Lớn hơn hoặc bằng
    LESS_THAN, // Nhỏ hơn
    LESS_THAN_OR_EQUAL, // Nhỏ hơn hoặc bằng
    IN, // Trong danh sách
    NOT_IN, // Không có trong danh sách
    CONTAINS, // Chứa chuỗi
    NOT_CONTAINS, // Không chứa chuỗi
    STARTS_WITH, // Bắt đầu với chuỗi
    ENDS_WITH, // Kết thúc với chuỗi
    EMPTY, // Trường không có giá trị
    NOT_EMPTY, // Trường có giá trị
    BETWEEN; // Trong khoảng thời gian
}
