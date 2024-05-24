import React, {useState, useEffect} from "react"
import { Table, Form, FormGroup, Input, Button, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Nav,
  NavItem,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand, } from "reactstrap"
import { Bar } from "react-chartjs-2"
import zoomPlugin from "chartjs-plugin-zoom"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  
} from "chart.js"
import {SERVER_HOSTNAME, SERVER_PORT} from "./config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  zoomPlugin,
  LineController,
);

const extractValues = (observationData, code) => {
  return observationData.map(
    (item) =>
      item.resource.component.find(
        (component) => component.code.coding[0].code === code
      )?.valueQuantity.value
  )
}

const PatientRecord = () => {
  const [patientInfo, setPatientInfo] = useState({
    identifier: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: ""
  })

  const cachedObservationData = JSON.parse(localStorage.getItem("observationData"));
  const [observationData, setObservationData] = useState(cachedObservationData || []);
  const [systolicValues, setSystolicValues] = useState([]);
  const [diastolicValues, setDiastolicValues] = useState([]);
  const [heartRateValues, setHeartRateValues] = useState([]);
  const [dates, setDates] = useState([]);
  const [patientId, setPatientId] = useState('')

  useEffect(() => {
    setSystolicValues(extractValues(observationData, '8480-6'));
    setDiastolicValues(extractValues(observationData, '8462-4'));
    setHeartRateValues(extractValues(observationData, '8867-4'));
    setDates(observationData.map(item => new Date(item.resource.effectiveDateTime).toLocaleString('de-DE')));
  }, [observationData]);

  const handleFormSearchChange = (event) => {
    setPatientId(event.target.value); // Update the patientId state with the new value
  };

  const handleFetchObservation = async() => {
    try {
      let url = `https://${SERVER_HOSTNAME}:${SERVER_PORT}/fhir/Observation?subject=Patient/${patientId}`;
      let allEntries = [];

      while (url) {
        const response = await fetch(url);
        const json = await response.json();
        const entries = json.entry || [];
        allEntries.push(...entries);

        // Check if there is a 'next' link and update the URL for the next page
        const nextLink = json.link?.find((link) => link.relation === 'next');
        url = nextLink ? nextLink.url : null;
      }

      setObservationData(allEntries);
      localStorage.setItem("observationData", JSON.stringify(allEntries));
    } catch (error) {
      console.error("[fetchObservation] error:", error);
      setObservationData([]);
      localStorage.removeItem("observationData");
    }
  }

  const handleFetchPatient = async(event) => {
    event.preventDefault();
    if (patientId) {
    try {
      const response = await fetch(`https://${SERVER_HOSTNAME}:${SERVER_PORT}/fhir/Patient/${patientId}`);
      const patientResource = await response.json();
      console.log("json", patientResource.gender)
      if(patientResource.resourceType === "Patient") {
        setPatientInfo({
            identifier: patientResource.id || "",
            firstName: patientResource.name[0]?.given[0] || "", // Taking the first given name
            lastName: patientResource.name[0]?.family || "",
            gender: patientResource.gender || "",
            dateOfBirth: patientResource.birthDate || ""
        });
      } else {
        console.debug("[handleFetchPatient]: datas are not a patient resource");
      }
    } catch (error) {
      console.error("[handleFetchPatient] error:", error);
    }
    }
  }

const chartOptions = {
  scales: {
    y: {
      position: 'left',
      title: {
        display: true,
        text: "Blood pressure [mmHg] & Heart Rate [bpm]",
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'x',
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
      limits: {
        x: {
          min: 'original',
          max: 'original',
          minRange: 20
        },
      }
    },
  },
};

  const chartData = {
    labels: dates,
    datasets: [
      {
        type: "line",
        pointRadius: 3,
        label: "Fréq. cardiaque",
        data: heartRateValues,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)'
      },
      {
        type: "bar",
        label: "Systolique",
        data: systolicValues,
        backgroundColor: 'rgb(147, 207, 169)',
      },
      {
        type: "bar",
        label: "Diastolique",
        data: diastolicValues,
        backgroundColor: 'rgb(101, 198, 193)',
      },
    ],
  };

  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  const [bpClicked, setBpClicked] = useState(true);
  const showBpMeasurements = () => setBpClicked(!bpClicked);

  return (
    <div>
      <Form onSubmit={handleFetchPatient} style={{ width: "47%", margin: "0 auto"}}>
        <FormGroup style={{ display: "flex" }}>
          <Input
            type="text"
            name="patientId"
            id="patientId"
            placeholder="Identifiant"
            value={patientId}
            onChange={handleFormSearchChange}
            style={{ marginRight: "10px" }}
          />
          <Button  className="custom-button">Recherche</Button>
        </FormGroup>
      </Form>
      {patientInfo.identifier  ? (
      <div >

      <Card className="patient-details" style={{ width: "47%", margin: "0 auto"}}>
      <CardBody>
      <CardTitle tag="h3">Coordonnées</CardTitle>
        <ListGroup flush>
        <ListGroupItem><strong>Identifiant: </strong> {patientInfo.identifier}</ListGroupItem>
          <ListGroupItem><strong>Prénom: </strong> {patientInfo.firstName}</ListGroupItem>
          <ListGroupItem><strong>Nom: </strong> {patientInfo.lastName}</ListGroupItem>
          <ListGroupItem><strong>Genre: </strong> {patientInfo.gender}</ListGroupItem>
          <ListGroupItem><strong>Date de naissance: </strong> {new Date(patientInfo.dateOfBirth).toLocaleDateString('de-DE')}</ListGroupItem>
        </ListGroup>
      </CardBody>
    </Card>
    <Navbar color="faded" light style={{ width: "47%", margin: "0 auto"}}>
        <NavbarBrand href="/" className="me-auto">
          Observations
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="me-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem onClick={() => {handleFetchObservation(); showBpMeasurements();}}>
              Blood Pressure
            </NavItem>
            <NavItem>
              Cholestérol
            </NavItem>
            <NavItem>
              Glycémie
            </NavItem>
            <NavItem>
              Poids
            </NavItem>
            <NavItem>
              SpO2
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    <div>
      
    </div>

    </div>
    ) : null}

      {observationData && observationData.length && !bpClicked > 0 ? (
        <div >
          <Bar data={chartData} options={chartOptions} />
          <Table hover responsive size="sm">
            <thead className="custom-table-header">
              <tr >
                <th>Observation #</th>
                <th>Systolique</th>
                <th>Diastolique</th>
                <th>Fréq. Cardiaque</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="table">
              {observationData.map((item, index) => (
                <tr key={index}>
                  <td> {index} </td>
                  <td> {systolicValues[index]} </td>
                  <td> {diastolicValues[index]} </td>
                  <td> {heartRateValues[index]} </td>
                  <td> {dates[index]} </td>
                  <td />
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}

export default PatientRecord
