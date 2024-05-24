package com.example.scratch.fhir.observation;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
@JsonDeserialize(using = ReferenceDeserializer.class)
public class Reference {
    //@Column(name = "reference")
    private String id;

    public Reference() {
    }

    public Reference(String reference) {
        this.id = reference;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Subject{" +
                ", reference='" + id + '\'' +
                '}';
    }
}