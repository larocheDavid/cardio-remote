package com.example.scratch.fhir.patient;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "/Patient")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping(path="/all")
    public List<Patient> getPatients() {
        return patientService.getPatients();
    }

    @GetMapping(path= "/{patientId}")
    public Patient getPatientById(@PathVariable("patientId") Long patientId) {
        return patientService.getPatientById(patientId);
    }
    @PostMapping
    public Patient registerNewPatient(@RequestBody Patient patient) throws IllegalArgumentException {
        return  patientService.addNewPatient(patient);
    }

    @DeleteMapping(path= "/{patientId}")
    public void deletePatient(@PathVariable("patientId") Long patientId) {
        patientService.deletePatient(patientId);
    }

    @PutMapping(path = "/{patientId}")
    public void updatePatient(@PathVariable("patientId") Long patientId,
                              @RequestParam(required = false) String[] given,
                              @RequestParam(required = false) String family) {
        patientService.updatePatient(patientId, given, family);
    }
}
