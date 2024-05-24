import csv
import requests
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

# Define the FHIR server URL
fhir_server_url = "http://localhost:8080/fhir"

# Read the CSV file
csv_file = "pressure_heart_rate_data_normalized_utf8.csv"  

observations = []

start_date = datetime.now() - relativedelta(years=4)  # Subtract 4 years from the current date

with open(csv_file, "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        systolic = float(row["systolic"])
        diastolic = float(row["diastolic"])
        heart_rate = float(row["heart rate"])
        effective_date_time = row["date"]

        # Create an observation dictionary for each record
        observation = {
            "resourceType": "Observation",
            #"id": "vital-signs",
            "meta": {
                "profile": ["http://hl7.org/fhir/StructureDefinition/vitalsigns"],
            },
            "identifier": [
                {
                    "system": "urn:ietf:rfc:3986",
                    "value": "urn:uuid:187e0c12-8dd2-67e2-99b2-bf273c878281",
                },
            ],
            "basedOn": [
                {
                    "identifier": {
                        "system": "https://acme.org/identifiers",
                        "value": "1234",
                    },
                },
            ],
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                            "code": "vital-signs",
                            "display": "Vital Signs",
                        },
                    ],
                },
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "85354-9",
                        "display": "Blood pressure panel with all children optional",
                    },
                ],
                "text": "Blood pressure systolic & diastolic",
            },
            "subject": {
                "reference": "Patient/1",
            },
            "effectiveDateTime": effective_date_time,#start_date.isoformat() + "Z",  # Convert date and time to ISO format
            "bodySite": {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "368208006",
                        "display": "Left upper arm",
                    },
                ],
            },
            "component": [
                {
                    "code": {
                        "coding": [
                            {
                                "system": "http://loinc.org",
                                "code": "8480-6",
                                "display": "Systolic blood pressure",
                            },
                        ],
                    },
                    "valueQuantity": {
                        "value": systolic,
                        "unit": "mmHg",
                        "system": "http://unitsofmeasure.org",
                        "code": "mm[Hg]",
                    },
                },
                {
                    "code": {
                        "coding": [
                            {
                                "system": "http://loinc.org",
                                "code": "8462-4",
                                "display": "Diastolic blood pressure",
                            },
                        ],
                    },
                    "valueQuantity": {
                        "value": diastolic,
                        "unit": "mmHg",
                        "system": "http://unitsofmeasure.org",
                        "code": "mm[Hg]",
                    },
                },
                {
                    "code": {
                        "coding": [
                            {
                                "system": "http://loinc.org",
                                "code": "8867-4",
                                "display": "Heart rate",
                            },
                        ],
                    },
                    "valueQuantity": {
                        "value": heart_rate,
                        "unit": "beats/minute",
                        "system": "http://unitsofmeasure.org",
                        "code": "/min",
                    },
                },
            ],
        }

        observations.append(observation)

        # Increment the date by three days for the next record
        #start_date += timedelta(days=3)
        

# Iterate over the observations list and POST each observation to the FHIR server
for observation in observations:
    response = requests.post(fhir_server_url + "/Observation?_format=json&_pretty=true", json=observation)
    if response.status_code == 201:
        print("Observation created successfully")
    else:
        print("Failed to create observation:", response.text)

