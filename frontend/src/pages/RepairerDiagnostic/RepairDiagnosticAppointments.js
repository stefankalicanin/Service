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
    "id_device": diagnosticReport.id_device,
    "id_diagnostic" : diagnosticReport.id
  })
  .then(res => {
    alert("Successfully created diagnostic report")
    window.location.assign('/repairerd/diagnostic_schedule_appointments')
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
  const index = e.target.selectedIndex
  const el = e.target.childNodes[index]
  const id = el.getAttribute('id')
  setDiagnosticReport({...diagnosticReport, ["id_device"] : id})
}
  return (
    <div>
      {!checkTableEmpty &&
      <div style={{width : '70%',
                    margin : 'auto',
                    marginTop : '100px'
                }}>
 
  <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">Start time</th>
      <th scope="col">End time</th>
      <th scope="col">Device</th>
      <th scope="col">Category</th>
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
      <th><Button variant="success" onClick={() => initModal(dsa)}>Write report</Button></th>
    </tr>
   ))}
  </tbody>
</table>

</div>}
<Modal show={showModal}>
        <Modal.Header closeButton onClick={()=> setShowModal(!showModal)}>
          <Modal.Title>Create dagnostic report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter description" name="description" value={diagnosticReport.description} onChange={handleFormInputChange("description")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicType">
                <select className="form-select" aria-label="Default select example" onChange={chooseDevice} required={true}>
              <option selected>Choose device</option>
              {device.map(c => 
              <option id = {c.id}>{c.name}</option>
              )}
            </select>
                </Form.Group>
        </Form>
        <Button variant="success" onClick={()=> diagnosticScheduleAppointmentDone(diagnosticReport.id)}>Confirm</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModal(!showModal)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RepairDiagnosticAppointments