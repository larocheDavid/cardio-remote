import "./App.css"
import "./fonts/CooperHewitt-Light.otf"
import PatientForm from "./PatientForm"
import PatientRecord from "./PatientRecord"
import { useState } from "react"
import {
  Container,
  Row,
  Col,
} from "reactstrap"
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavLinkClick = (component) => {
    setActiveComponent(component);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'SuiviPatient':
        return <p>v1<br />
        2023<br />David Laroche</p>;
      case 'PatientForm':
        return <PatientForm/>;
      case 'ObservationSearch':
        return <PatientRecord />;
      default:
        return null;
    }
  };

  return (
      <div >
          <Row className="banner">
            {/* Title */}
            <Col md="4">
              <div className="cell-navBar" onClick={() => handleNavLinkClick('SuiviPatient')}>
              CardioRemote
              </div>
            </Col>
            {/* Buttons */}
              <Col md="4" className="text-md-right">
              <div
                className="cell-navBar" onClick={() => handleNavLinkClick('ObservationSearch')}
              >
                Dossier Patient
              </div>
              </Col>
              <Col md="4" >
              <div
                className="cell-navBar" onClick={() => handleNavLinkClick('PatientForm')}
              >
                Enregistrement Patient
              </div>
              </Col>
          </Row>
      <Container className="not-banner">
      {renderActiveComponent()}
      </Container>
    </div>
  );
}

export default App
