package com.safety.backend.repository;

import com.safety.backend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByReportNumber(String reportNumber);

    List<Report> findByTypeOrderByCreatedAtDesc(String type);

    List<Report> findByStatusOrderByCreatedAtDesc(String status);

    List<Report> findByDivisionOrderByCreatedAtDesc(String division);

    List<Report> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(r) FROM Report r WHERE r.type = :type")
    long countByType(String type);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    long countByStatus(String status);

    @Query("SELECT MAX(r.id) FROM Report r")
    Long getMaxId();
}
