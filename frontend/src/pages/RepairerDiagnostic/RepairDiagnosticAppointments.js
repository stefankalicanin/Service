import {React, useEffect, useState} from 'react'
import axios  from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form';
import { TokenService } from '../../services/TokenService'

function RepairDiagnosticAppointments() {

 const decoded_token = TokenService.decodeToken(TokenService.getToken())
 const [diagnosticScheduleAppointments, setDiagnosticScheduleAppointments] = useState([])
 const [checkTableEmpty, setCheckTableEmpty] = useState(false)
 const [showModal, setShowModal] = useState(false)
 const [diagnosticReport, setDiagnosticReport] = useState({})
 const [device, setDevice] = useState([])
 const[other, setOther] = useState(false)
 const[check, setCheck] = useState(false)
 
 useEffect(() => {
  axios.get(`http://localhost:8000/api/repairer/profile/${decoded_token.user_id}`)
  .then(response => {
    const id = response.data.id
    axios.get(`http://localhost:8000/api/repairer/diagnostic_schedule_appointments/${id}`)
    .then(response => {
      setDiagnosticScheduleAppointments(response.data)
      console.log(response.data)
      if(response.data.length === 0)
      {
        setCheckTableEmpty(true)
      }
    })
  })
  .then(error => {
    console.log(error)
  })
 }, [])

 
 
 const diagnosticScheduleAppointmentDone = (id) => {
  axios.post(`http://localhost:8000/api/repairer/update_diagnostic_schedule_appointment_done/${id}`)
  .then(response => {
   
  })
  .then(error => {
    console.log(error)
  })
  axios.post('http://localhost:8000/api/user/diagnostic_report',
  {
    "description" : diagnosticReport.description,
    "state": check,
    "id_diagnostic" : diagnosticReport.id,
    "broken_device": diagnosticReport.broken_device
  })
  .then(res => {
    alert("Successfully created diagnostic report")
    window.location.reload()
  })
 }
 const initModal = (diagnostic_schedule_appointment) => {
  setDiagnosticReport({...diagnosticReport, ["id"] : diagnostic_schedule_appointment.id})
  axios.get(`http://localhost:8000/api/user/device/devices/${diagnostic_schedule_appointment.device.id}`)
  .then(res => {
    setDevice(res.data)
  })
  .catch(error => {
    console.log(error)
  })
  return setShowModal(!showModal)
}

const handleFormInputChange = (name) => (event) => {
  const val = event.target.value;
  setDiagnosticReport({...diagnosticReport, [name] : val})
  
};
const chooseDevice = (e) => {
  
  const selectedDevice = e.target.value;
  if (selectedDevice === 'other')
  {
    setOther(true)
  }
  else
  {
    setDiagnosticReport({...diagnosticReport, ["broken_device"]:selectedDevice})
  }
}

const handleTypeDiagnostic = (type) => {
  if(type === 'HOUSE') {
    return 'Kućna dijagnostika'
  }
  else 
  {
    return 'U servisu'
  }
}

const handleCheckBoxChange = () => {
  setCheck(!check)
}
  return (
    <div>
      {!checkTableEmpty &&
      <div style={{
                    margin : 'auto',
                    marginTop : '100px',
                    marginLeft:'90px'
                }}>
  <h1 style={{marginBottom:'40px', marginLeft:'170px'}}>Pregled zahteva za dijagnostiku</h1>
  <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">Početak</th>
      <th scope="col">Kraj</th>
      <th scope="col">Uredjaj</th>
      <th scope="col">Kategorija</th>
      <th scope="col">Tip</th>
      <th scope="col">Report</th>
    </tr>
  </thead>
  <tbody>
   {diagnosticScheduleAppointments.map(dsa => (
    <tr key = {dsa.id}>
      <th>{dsa.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
      <th>{dsa.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
      <th>{dsa.device.name}</th>
      <th>{dsa.device.category.name}</th>
      <th>{handleTypeDiagnostic(dsa.type_house)}</th>
      <th>{dsa.type_house === 'IN SERVICE' ?<Button variant="success" onClick={() => initModal(dsa)}>Napiši izveštaj</Button>
      :<Button className="btn-danger">Putni nalog</Button>}</th>
    </tr>
   ))}
  </tbody>
</table>

</div>}
<Modal show={showModal}>
        <Modal.Header closeButton onClick={()=> setShowModal(!showModal)}>
          <Modal.Title>Kreiranje izveštaja o dijagnostici</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" placeholder="Unesite opis dijagnostike..." name="description" value={diagnosticReport.description} onChange={handleFormInputChange("description")}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicType">
                <Form.Label>Pokvareni uredjaj</Form.Label>
                <select className="form-select" aria-label="Default select example" onChange={chooseDevice} required={true}
                >
                  <option value="empty">Selektuj</option>
              {device.map(c => 
              <option value={c.name}>{c.name}</option>
              )}
              <option value="other">Drugi uredjaj</option>
            </select>
                </Form.Group>
                {other && <Form.Group className="mb-3" controlId="formBasicNewDevice">
                    <Form.Label>Naziv uredjaja</Form.Label>
                    <Form.Control type="text" placeholder="Unesite naziv uredjaja..." name="description" value={diagnosticReport.broken_device} onChange={handleFormInputChange("broken_device")}
                    />
                    <Form.Text>Dodajte novi pokvareni uredjaj.</Form.Text>
                </Form.Group>}
                <Form.Group className="mb-3"  controlId="formBasicCheckbox" checked={check} onChange={handleCheckBoxChange}>
          <Form.Check type="checkbox"  label="Uspešno obavljena dijagnostika" />
        </Form.Group>
        </Form>
        <Button variant="success" onClick={()=> diagnosticScheduleAppointmentDone(diagnosticReport.id)}>Potvrdi</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModal(!showModal)}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RepairDiagnosticAppointments