package com.example.scratch.fhir.patient;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List <Patient> getPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long patientId) {
        return patientRepository.findById(patientId).orElseThrow(() ->
                new IllegalStateException(
                        "patient with id" + patientId + "does not exists"));
    }

    public Patient addNewPatient(Patient patient) throws IllegalArgumentException {
        Optional<Patient> patientOptional = patientRepository.findPatientById(patient.getId());
        if (patientOptional.isPresent()) {
            throw new IllegalArgumentException("id taken");
        }
        return patientRepository.save(patient);
    }

    public void deletePatient(Long patientId) {
        boolean exists = patientRepository.existsById(patientId);
        if(!exists) {
            throw new IllegalStateException(
                        "patient with id" + patientId + "does not exists");
        }
        patientRepository.deleteById(patientId);
    }

    @Transactional
    public void updatePatient(Long patientId, String[] given, String family) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() ->
                new IllegalStateException(
                    "patient with id" + patientId + "does not exists"));

        if (given != null && given.length > 0) {
            // Assuming the patient has only one name in the list.
            if (patient.getName() == null || patient.getName().isEmpty()) {
                // If the patient doesn't have a name, create a new one and add it to the list.
                List<Name> nameList = new ArrayList<>();
                nameList.add(new Name(given, family));
                patient.setName(nameList);
            } else {
                // If the patient already has a name, update the existing name.
                patient.getName().get(0).setGiven(given);
                patient.getName().get(0).setFamily(family);
            }
        }
        // No need to check for null or empty for the family name because it's handled in the Name class.

        // Save the updated patient object to the database.
        patientRepository.save(patient);
    }
}