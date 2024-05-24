package com.example.scratch.fhir.observation;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/Observation")
public class ObservationController {
    private final ObservationService observationService;

    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }

    @GetMapping(path="/all")
    public List<Observation> getObservations() {
        return observationService.getObservations();
    }

    @GetMapping("/{observationId}")
    public Observation getObservationById(@PathVariable("observationId") Long observationId) {
        return observationService.getObservationById(observationId);
    }

    @GetMapping
    public ObjectNode getObservationsBySubject(@RequestParam("subject") String subject) {
        return observationService.getObservationsBySubject(subject);
    }

    @PostMapping
    public ResponseEntity<String> registerNewObservation(@RequestBody Observation observation) {
        try {
            observationService.addNewObservation(observation);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"status\":\"success\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping(path= "/{observationId}")
    public void deleteObservation(@PathVariable("observationId") Long observationId) {
        observationService.deleteObservation(observationId);
    }
}
