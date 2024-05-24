package com.example.scratch.fhir.observation;

import jakarta.persistence.*;

import java.util.List;
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(cascade = {CascadeType.ALL})
    private List<Coding> coding;

    public Category() {
    }

    public Category(List<Coding> coding) {
        this.coding = coding;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Coding> getCoding() {
        return coding;
    }

    public void setCoding(List<Coding> coding) {
        this.coding = coding;
    }

    @Override
    public String toString() {
        return "Category{" +
                "coding=" + coding +
                '}';
    }
}
