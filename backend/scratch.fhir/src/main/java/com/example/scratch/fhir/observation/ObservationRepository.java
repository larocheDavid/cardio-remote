package com.example.scratch.fhir.observation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ObservationRepository extends JpaRepository<Observation, Long> {

    @Query("SELECT o FROM Observation o WHERE o.id = ?1")
    Optional<Observation> findObservationById(Long id);

    List<Observation> findBySubjectId(String subjectId);

    @Query("SELECT o FROM Observation o WHERE o.subject.id = :subjectId AND o.effectiveDateTime = :effectiveDateTime")
    Optional<Observation> findObservationByFields(@Param("subjectId") String subjectId,  @Param("effectiveDateTime") String effectiveDateTime);
}
