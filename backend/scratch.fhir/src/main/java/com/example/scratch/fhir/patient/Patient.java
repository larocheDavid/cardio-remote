package com.example.scratch.fhir.patient;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table
public class Patient {
    @Id@SequenceGenerator(
            name = "patient_sequence",
            sequenceName = "patient_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "patient_sequence"
    )

    private Long id;
    private String resourceType;
    @ElementCollection

    private List<Name> name;

    private LocalDate birthDate;

    private String gender;


    public Patient() {
        this.resourceType = "Patient";
    }

    public Patient(Long id, List<Name> name, LocalDate birthDate, String gender) {
        this.resourceType = "Patient";
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
    }

    public Patient(List<Name> name, LocalDate birthDate, String gender) {
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient(List<Name> name) {
        this.name = name;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public List<Name> getName() {
        return name;
    }

    public void setName(List<Name> name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Patient{id=").append(id);
        sb.append(", resourceType='").append(resourceType).append('\'');
        if (name != null && !name.isEmpty()) {
            sb.append(", givenName='").append(String.join(" ", name.get(0).getGiven())).append('\'');
            sb.append(", familyName='").append(name.get(0).getFamily()).append('\'');
        }
        sb.append(", birthDate=").append(birthDate);
        sb.append(", gender='").append(gender).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
