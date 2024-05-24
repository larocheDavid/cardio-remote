package com.example.scratch.fhir.observation;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class ObservationSerializer extends JsonSerializer<Observation> {
    @Override
    public void serialize(Observation observation, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
            throws IOException {
        jsonGenerator.writeStartObject();

        jsonGenerator.writeNumberField("id", observation.getId());

        jsonGenerator.writeStringField("resourceType", observation.getResourceType());

        // Omit the 'id' field from the 'meta' object
        jsonGenerator.writeObjectFieldStart("meta");
        jsonGenerator.writeObjectField("profile", observation.getMeta().getProfile());
        jsonGenerator.writeEndObject();

        // Omit the 'id' field from the 'identifier' list
        jsonGenerator.writeArrayFieldStart("identifier");
        for (Identifier identifier : observation.getIdentifier()) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField("system", identifier.getSystem());
            jsonGenerator.writeStringField("value", identifier.getValue());
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();

        // Omit the 'id' field from the 'category' list
        jsonGenerator.writeArrayFieldStart("category");
        for (Category category : observation.getCategory()) {
            jsonGenerator.writeStartObject();
            // Omit the 'id' field from the 'coding' list
            jsonGenerator.writeArrayFieldStart("coding");
            for (Coding coding : category.getCoding()) {
                jsonGenerator.writeStartObject();
                jsonGenerator.writeStringField("system", coding.getSystem());
                jsonGenerator.writeStringField("code", coding.getCode());
                jsonGenerator.writeStringField("display", coding.getDisplay());
                jsonGenerator.writeEndObject();
            }
            jsonGenerator.writeEndArray();
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();

        // Omit the 'id' field from the 'code' object
        jsonGenerator.writeObjectFieldStart("code");
        // Omit the 'id' field from the 'coding' list
        jsonGenerator.writeArrayFieldStart("coding");
        for (Coding coding : observation.getCode().getCoding()) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField("system", coding.getSystem());
            jsonGenerator.writeStringField("code", coding.getCode());
            jsonGenerator.writeStringField("display", coding.getDisplay());
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();
        jsonGenerator.writeStringField("text", observation.getCode().getText());
        jsonGenerator.writeEndObject();

        // Omit the 'id' field from the 'subject' object
        jsonGenerator.writeObjectFieldStart("subject");
        jsonGenerator.writeStringField("id", observation.getSubject().getId());
        jsonGenerator.writeEndObject();

        jsonGenerator.writeStringField("effectiveDateTime", observation.getEffectiveDateTime());

        // Omit the 'id' field from the 'bodySite' object
        jsonGenerator.writeObjectFieldStart("bodySite");
        // Omit the 'id' field from the 'coding' list
        jsonGenerator.writeArrayFieldStart("coding");
        for (Coding coding : observation.getBodySite().getCoding()) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeStringField("system", coding.getSystem());
            jsonGenerator.writeStringField("code", coding.getCode());
            jsonGenerator.writeStringField("display", coding.getDisplay());
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();
        jsonGenerator.writeEndObject();

        // Omit the 'id' field from the 'component' list
        jsonGenerator.writeArrayFieldStart("component");
        for (Component component : observation.getComponent()) {
            jsonGenerator.writeStartObject();
            // Omit the 'id' field from the 'code' object
            jsonGenerator.writeObjectFieldStart("code");
            // Omit the 'id' field from the 'coding' list
            jsonGenerator.writeArrayFieldStart("coding");
            for (Coding coding : component.getCode().getCoding()) {
                jsonGenerator.writeStartObject();
                jsonGenerator.writeStringField("system", coding.getSystem());
                jsonGenerator.writeStringField("code", coding.getCode());
                jsonGenerator.writeStringField("display", coding.getDisplay());
                jsonGenerator.writeEndObject();
            }
            jsonGenerator.writeEndArray();
            jsonGenerator.writeEndObject();

            jsonGenerator.writeObjectFieldStart("valueQuantity");
            jsonGenerator.writeNumberField("value", component.getValueQuantity().getValue());
            jsonGenerator.writeStringField("unit", component.getValueQuantity().getUnit());
            jsonGenerator.writeStringField("system", component.getValueQuantity().getSystem());
            jsonGenerator.writeStringField("code", component.getValueQuantity().getCode());
            jsonGenerator.writeEndObject();

            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();

        jsonGenerator.writeEndObject();
    }
}