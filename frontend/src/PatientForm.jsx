import React ,{useState} from "react"
import { Form, FormGroup, Label, Input, Button } from "reactstrap"
import {SERVER_PORT, SERVER_HOSTNAME} from "./config.js"
const PatientForm = () => {

  const [patientInfo, setPatientInfo] = useState({
    identifier: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: ""
  })
  
  const handlePatientChange = (e) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value })
  }
 
  const handlePatientSubmit = (e) => {
    e.preventDefault()

    const patient = {
      resourceType: "Patient",
      name: [
        {
          given: [patientInfo.firstName],
          family: patientInfo.lastName,
        },
      ],
      gender: patientInfo.gender,
      birthDate: patientInfo.dateOfBirth,
    }
    console.debug(JSON.stringify(patient))
    fetch(`https://${SERVER_HOSTNAME}:${SERVER_PORT}/fhir/Patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    })
    .then((response) => response.json())
      .then((data) => {
        setPatientInfo(prevState => ({
          ...prevState,
          identifier: data.id
        }));
        console.log(data.id)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  const genderOptions = [
    { value: "male", label: "male" },
    { value: "female", label: "female" },
    { value: "other", label: "other" },
  ]

  return (
    <Form onSubmit={handlePatientSubmit} style={{ width: "50%", margin: "0 auto"}}>
      <FormGroup>
        <Input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Prénom"
          value={patientInfo.firstName}
          onChange={handlePatientChange}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Nom"
          value={patientInfo.lastName}
          onChange={handlePatientChange}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="select"
          name="gender"
          id="gender"
          value={patientInfo.gender}
          onChange={handlePatientChange}
        >
          <option value="">Genre</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Input>
      </FormGroup>

      <FormGroup>
      <Label for="dob">Date de naissance</Label>
        <Input
          type="date"
          name="dateOfBirth"
          id="dob"
          value={patientInfo.dateOfBirth}
          onChange={handlePatientChange}
        />
      </FormGroup>
      <Button className="custom-button" >Soumettre</Button>
      {patientInfo.identifier && (
        <p style={{ display: "inline-block", marginLeft: "10px" }}>
          <span>Patient créé, identifiant  n°{patientInfo.identifier})</span>
        </p>
      )}
    </Form>
  )
}

export default PatientForm
