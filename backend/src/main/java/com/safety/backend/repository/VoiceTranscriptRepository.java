package com.safety.backend.repository;

import com.safety.backend.model.VoiceTranscript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoiceTranscriptRepository extends JpaRepository<VoiceTranscript, Long> {
    Optional<VoiceTranscript> findByReportId(Long reportId);
}
