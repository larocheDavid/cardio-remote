package com.example.scratch.fhir.observation;

import jakarta.persistence.*;

//@Embeddable
@Entity
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Embedded
    private CodeableConcept code;
    @Embedded
    private ValueQuantity valueQuantity;

    public Component() {
    }

    public Component(CodeableConcept code, ValueQuantity valueQuantity) {
        this.code = code;
        this.valueQuantity = valueQuantity;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CodeableConcept getCode() {
        return code;
    }

    public void setCode(CodeableConcept code) {
        this.code = code;
    }

    public ValueQuantity getValueQuantity() {
        return valueQuantity;
    }

    public void setValueQuantity(ValueQuantity valueQuantity) {
        this.valueQuantity = valueQuantity;
    }

    @Override
    public String toString() {
        return "Component{" +
                "code=" + code +
                ", valueQuantity=" + valueQuantity +
                '}';
    }
}
