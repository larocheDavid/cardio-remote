package com.example.scratch.fhir.observation;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

class ReferenceDeserializer extends StdDeserializer<Reference> {
    public ReferenceDeserializer() {
        this(null);
    }

    public ReferenceDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Reference deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        ObjectCodec codec = jp.getCodec();
        JsonNode node = codec.readTree(jp);
        String reference = node.get("reference").asText();
        //String id = reference.substring(reference.indexOf("/") + 1);
        return new Reference(reference);
    }
}
