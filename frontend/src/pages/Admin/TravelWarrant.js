import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/Modal'
import { Form } from 'react-bootstrap';

function TravelWarrant() {

  const [travelWarrant, setTravelWarrant] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [diagnosticRequest, setDiagnosticRequest] = useState({})
  const [travelWarrantId, setTravelWarrantId] = useState()

  useEffect(()=> {
    axios.get('http://localhost:8000/api/admin/travel_warrant_unapproved/diagnostic')
    .then(response => {
      console.log(response.data)
      setTravelWarrant(response.data)
    })
    .then(error => {
      console.log(error)
    })
  }, [])

  const getDetailsOfTravelWarrantDiagnostic = (tw) => {
    setTravelWarrantId(tw.id)
    axios.get(`http://localhost:8000/api/admin/diagnostic_request/${tw.schedule_appointment.id}`)
    .then(response => {
      console.log(response.data)
      setDiagnosticRequest(response.data)
      setShowModal(!showModal)
    })
    .catch(error => {
      console.log(error)
    })
  }


  const confirmTravelWarrant = (id) => {
    axios.post('http://localhost:8000/api/admin/travel_warrant/diagnostic/approved', {
      "id":id
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const refuseTravelWarrant = (id) => {
    axios.post('http://localhost:8000/api/admin/travel_warrant/diagnostic/unapproved', {
      "id":id
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }
  return (
    <div>
      <div style ={{width:'70%', margin:'auto', marginTop:'90px'}}>
        <h1 style={{marginLeft:'350px', marginBottom:'30px'}}>Pregled putnih naloga</h1>
        <table class="table table-dark">
          <thead>
            <tr>
              <th>Početak</th>
              <th>Kraj</th>
              <th>Uvid u detalje</th>
            </tr>
          </thead>
          <tbody>
            {travelWarrant.map(tw => (
              <tr key = {tw.id}>
                <th>{tw.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
                <th>{tw.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
                <th><Button className='btn-danger' onClick={()=>getDetailsOfTravelWarrantDiagnostic(tw)}>Detalji</Button></th>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal show={showModal}>
      <Modal.Header closeButton onClick={()=>setShowModal(!showModal)}>
        <Modal.Title>Detalji o putnom nalogu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <h3>Podaci o serviseru koji traži putni nalog</h3>
      <p>Ime: {diagnosticRequest.schedule_appointment?.repairer_profile?.user?.first_name || 'N/A'}</p>
      <p>Prezime: {diagnosticRequest.schedule_appointment?.repairer_profile?.user?.last_name || 'N/A'}</p>
      <h3>Podaci o uređaju za dijagnostiku</h3>
      <p>Naziv: {diagnosticRequest.device?.name || 'N/A'}</p>
      <p>Kategorija: {diagnosticRequest.device?.category?.name || 'N/A'}</p>
      <h3>Da li želite da izdate putni nalog?</h3>
      <div style={{marginTop:'30px'}}>
        <Button className='btn-primary' style={{marginLeft:'50px', width:'100px'}} onClick={()=>confirmTravelWarrant(travelWarrantId)}>Da</Button>
        <Button className='btn-danger' style={{marginLeft:'120px', width:'100px'}} onClick={()=>refuseTravelWarrant(travelWarrantId)}>Ne</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModal(!showModal)}>
            Zatvori
          </Button>
        </Modal.Footer>
    </Modal>
      </div>
    </div>
  )
}

export default TravelWarrant