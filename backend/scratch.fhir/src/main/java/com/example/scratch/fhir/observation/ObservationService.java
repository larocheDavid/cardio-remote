package com.example.scratch.fhir.observation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class ObservationService {
    @Autowired
    private final ObservationRepository observationRepository;

    public ObservationService(ObservationRepository observationRepository) {
        this.observationRepository = observationRepository;
    }
    public List<Observation> getObservations() {
        return observationRepository.findAll();
    }

    public Observation getObservationById(Long observationId) {
        return observationRepository.findById(observationId).orElseThrow(() ->
                new IllegalStateException(
                        "observation with id" + observationId + "does not exists"));

    }

    public ObjectNode getObservationsBySubject(String subject) {
        List<Observation> observations = observationRepository.findBySubjectId(subject);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode responseNode = objectMapper.createObjectNode();

        ArrayNode entryNodeArray = objectMapper.createArrayNode();

        for (Observation observation : observations) {

            ObjectNode resourceNode = objectMapper.valueToTree(observation);
            ObjectNode entryNode = objectMapper.createObjectNode();

            entryNode.put("id", observation.getId());
            entryNode.set("resource", resourceNode);
            entryNodeArray.add(entryNode);
        }
        responseNode.set("entry", entryNodeArray);

        return responseNode;
    }
    public void addNewObservation(Observation observation) throws IllegalArgumentException {
        // Check if an observation with the same fields already exists.
        Optional<Observation> existingObservation = observationRepository.findObservationByFields(
                observation.getSubject().getId(),
                observation.getEffectiveDateTime()
        );

        if (existingObservation.isPresent()) {
            throw new IllegalArgumentException("Observation with the same fields already exists.");
        }
        observationRepository.save(observation);
    }

    public void deleteObservation(Long observationId) {
        boolean exists = observationRepository.existsById(observationId);
        if(!exists) {
            throw new IllegalStateException(
                    "observation with id" + observationId + "does not exists");
        }
        observationRepository.deleteById(observationId);
    }
}
