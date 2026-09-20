package com.safety.backend.repository;

import com.safety.backend.model.IdCardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IdCardImageRepository extends JpaRepository<IdCardImage, Long> {
    Optional<IdCardImage> findByReportId(Long reportId);
}
