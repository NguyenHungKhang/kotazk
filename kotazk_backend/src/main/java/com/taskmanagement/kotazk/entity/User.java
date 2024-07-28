package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.entity.enums.UserActiveStatus;
import com.taskmanagement.kotazk.entity.enums.UserOnlineStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Entity
@Table(name = "user")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "bio", nullable = false)
    private String bio;

    @Column(name = "avatar", nullable = false)
    private String avatar;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "google_id", nullable = false)
    private String googleId;

    @Column(name = "hashed_password", nullable = false)
    private String hashedPassword;

    @Column(name = "salt", nullable = false)
    private String salt;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private UserActiveStatus accountStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "online_status", nullable = false)
    private UserOnlineStatus onlineStatus = UserOnlineStatus.OFFLINE;

    @Column(name = "active_token", nullable = true)
    private String activeToken;

    @Column(name = "active_deadline", nullable = true)
    private Timestamp activeDeadline;

    @Column(name = "reset_password_token", nullable = true)
    private String resetPasswordToken;

    @Column(name = "reset_password_deadline", nullable = true)
    private Timestamp resetPasswordDeadline;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ActivityLog> activityLogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Goal> goals;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp modifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role.name()));
    }
    @Override
    public String getPassword() {
        return this.hashedPassword;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.accountStatus == UserActiveStatus.ACTIVE;
    }
}
