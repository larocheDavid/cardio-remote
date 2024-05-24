package com.example.scratch.fhir.observation;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table
@JsonSerialize(using = ObservationSerializer.class)
public class Observation {
    private String resourceType;
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Embedded
    private Meta meta;
    @ElementCollection
    private List<Identifier> identifier;
    private String status;
    @OneToMany(cascade = {CascadeType.ALL})
    private List<Category> category;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name="text", column=@Column(name="code_text")),
    })
    private CodeableConcept code;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "id", column = @Column(name = "subject_id"))
    })
    private Reference subject;
    private String effectiveDateTime;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "text", column = @Column(name = "bodySite_text"))})
    private CodeableConcept bodySite;
    @OneToMany(cascade = {CascadeType.ALL})
    private List<Component> component;

    public Observation() {
    }

    public Observation(String resourceType, Meta meta, List<Identifier> identifier, String status,
                       List<Category> category, CodeableConcept code, Reference subject, String effectiveDateTime,
                       CodeableConcept bodySite, List<Component> component) {
        this.resourceType = resourceType;
        this.meta = meta;
        this.identifier = identifier;
        this.status = status;
        this.category = category;
        this.code = code;
        this.subject = subject;
        this.effectiveDateTime = effectiveDateTime;
        this.bodySite = bodySite;
        this.component = component;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Meta getMeta() {
        return meta;
    }

    public void setMeta(Meta meta) {
        this.meta = meta;
    }

    public List<Identifier> getIdentifier() {
        return identifier;
    }

    public void setIdentifier(List<Identifier> identifier) {
        this.identifier = identifier;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Category> getCategory() {
        return category;
    }

    public void setCategory(List<Category> category) {
        this.category = category;
    }

    public CodeableConcept getCode() {
        return code;
    }

    public void setCode(CodeableConcept code) {
        this.code = code;
    }

    public Reference getSubject() {
        return subject;
    }

    public void setSubject(Reference subject) {
        this.subject = subject;
    }

    public String getEffectiveDateTime() {
        return effectiveDateTime;
    }

    public void setEffectiveDateTime(String effectiveDateTime) {
        this.effectiveDateTime = effectiveDateTime;
    }

    public CodeableConcept getBodySite() {
        return bodySite;
    }

    public void setBodySite(CodeableConcept bodySite) {
        this.bodySite = bodySite;
    }

    public List<Component> getComponent() {
        return component;
    }

    public void setComponent(List<Component> component) {
        this.component = component;
    }

    @Override
    public String toString() {
        return "Observation{" +
                "resourceType='" + resourceType + '\'' +
                ", id='" + id + '\'' +
                ", meta=" + meta +
                ", identifier=" + identifier +
                ", status='" + status + '\'' +
                ", category=" + category +
                ", code=" + code +
                ", subject=" + subject +
                ", effectiveDateTime='" + effectiveDateTime + '\'' +
                ", bodySite=" + bodySite +
                ", component=" + component +
                '}';
    }
}