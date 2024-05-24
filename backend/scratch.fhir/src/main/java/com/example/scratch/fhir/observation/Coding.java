package com.example.scratch.fhir.observation;

import jakarta.persistence.*;

@Entity
public class Coding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String system;
    private String code;
    private String display;

    public Coding() {
    }

    public Coding(String system, String code, String display) {
        this.system = system;
        this.code = code;
        this.display = display;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    @Override
    public String toString() {
        return "Code{" +
                "system='" + system + '\'' +
                ", code='" + code + '\'' +
                ", display='" + display + '\'' +
                '}';
    }
}
