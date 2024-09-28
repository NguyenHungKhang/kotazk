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

    @Column(name = "font_color", length = 7) // Mã màu hex
    private String fontColor;

    @Column(nullable = false, length = 255) // Đường dẫn tới icon
    private String icon;

    @Column(length = 255) // Đường dẫn tới avatar
    private String avatar;

    @OneToOne(mappedBy = "customization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WorkSpace workSpace;

    @OneToOne(mappedBy = "customization", fetch = FetchType.LAZY)
    private Team team;

    @OneToOne(mappedBy = "customization", fetch = FetchType.LAZY)
    private Section section;

}
