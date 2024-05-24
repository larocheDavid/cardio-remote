package com.example.scratch.fhir.observation;

import jakarta.persistence.Embeddable;

@Embeddable
public class Identifier {
    private String system;
    private String value;

    public Identifier() {
    }

    public Identifier(String system, String value) {
        this.system = system;
        this.value = value;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Identifier{" +
                "system='" + system + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
