package com.example.scratch.fhir.patient;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class PatientConfiguration {
    @Bean
    CommandLineRunner commandLineRunner(PatientRepository patientRepository) {
        List<Name> names = new ArrayList<>();
        names.add(new Name(new String[]{"Mariam"}, "Muller"));
        return args -> {
            Patient mariam = new Patient(1L,
                    names,
                    LocalDate.of(2023, Month.JULY, 5),
                    "female");
            patientRepository.save(mariam);
        };
    }
}
