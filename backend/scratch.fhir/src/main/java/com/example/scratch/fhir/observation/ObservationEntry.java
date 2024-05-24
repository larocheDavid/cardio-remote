package com.example.scratch.fhir.observation;

public class ObservationEntry {
    private Observation resource;

    public ObservationEntry() {
    }

    public ObservationEntry(Observation resource) {
        this.resource = resource;
    }

    public Observation getResource() {
        return resource;
    }

    public void setResource(Observation resource) {
        this.resource = resource;
    }

    @Override
    public String toString() {
        return "ObservationEntry{" +
                "resource=" + resource +
                '}';
    }
}
