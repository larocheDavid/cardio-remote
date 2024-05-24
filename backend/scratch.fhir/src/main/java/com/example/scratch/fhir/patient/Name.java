package com.example.scratch.fhir.patient;

import jakarta.persistence.Embeddable;

@Embeddable
public class Name {

    private String[] given;

    private String family;

    public Name() {
    }

    public Name(String[] givenNames, String lastName) {
        this.given = givenNames;
        this.family = lastName;
    }

    public String[] getGiven() {
        return given;
    }

    public void setGiven(String[] given) {
        this.given = given;
    }

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }
}
