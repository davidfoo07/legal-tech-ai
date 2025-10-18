package com.lawlink.backend_java.chat;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="chat")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;
    private UUID userId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String message;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public Chat(UUID userId, String message) {
        this.userId = userId;
        this.message = message;
    }
}
