package com.example.scratch.fhir.observation;

import jakarta.persistence.*;
import java.util.List;

@Embeddable
public class CodeableConcept {
    @OneToMany(cascade = {CascadeType.ALL})
    private List<Coding> coding;
    private String text;

    public CodeableConcept() {
    }

    public CodeableConcept(List<Coding> coding, String text) {
        this.coding = coding;
        this.text = text;
    }

    public List<Coding> getCoding() {
        return coding;
    }

    public void setCoding(List<Coding> coding) {
        this.coding = coding;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    /*public Long getId() {
        return id;
    }*/

    @Override
    public String toString() {
        return "CodeableConcept{" +
                "coding=" + coding +
                ", text='" + text + '\'' +
                '}';
    }
}
