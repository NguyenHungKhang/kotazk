package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customization")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Customization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "background_color", nullable = false, length = 7) // Mã màu hex
    private String backgroundColor;

    @Column(name = "font_color", nullable = false, length = 7) // Mã màu hex
    private String fontColor;

    @Column(nullable = false, length = 255) // Đường dẫn tới icon
    private String icon;

    @Column(nullable = false, length = 255) // Đường dẫn tới avatar
    private String avatar;

}
