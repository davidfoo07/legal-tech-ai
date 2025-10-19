package com.lawlink.backend_java.repository;

import com.lawlink.backend_java.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    List<Chat> findByUserIdOrderByTimestampAsc(UUID userId);
}
