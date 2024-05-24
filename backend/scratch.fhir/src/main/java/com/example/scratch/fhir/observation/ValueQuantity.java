package com.example.scratch.fhir.observation;

import jakarta.persistence.Embeddable;

@Embeddable
public class ValueQuantity {

    private Double value;

    private String unit;

    private String system;

    private String code;

    public ValueQuantity() {
    }

    public ValueQuantity(Double value, String unit, String system, String code) {
        this.value = value;
        this.unit = unit;
        this.system = system;
        this.code = code;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
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

    @Override
    public String toString() {
        return "ValueQuantity{" +
                "value=" + value +
                ", unit='" + unit + '\'' +
                ", system='" + system + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}
