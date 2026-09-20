package com.safety.backend.repository;

import com.safety.backend.model.CorrectiveAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CorrectiveActionRepository extends JpaRepository<CorrectiveAction, Long> {
    Optional<CorrectiveAction> findByReportId(Long reportId);
}
