package com.example.scratch.fhir.observation;

import jakarta.persistence.Embeddable;
import java.util.List;
@Embeddable
public class Meta {
    private List<String> profile;
    public Meta() {
    }

    public Meta(List<String>  profile) {
        this.profile = profile;
    }

    public List<String>  getProfile() {
        return profile;
    }

    public void setProfile(List<String>  profile) {
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "Meta{" +
                "profile=" + profile +
                '}';
    }
}
