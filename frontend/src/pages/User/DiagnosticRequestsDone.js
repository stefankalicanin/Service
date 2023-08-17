import {Children, React, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import Form from 'react-bootstrap/Form'

function DiagnosticRequestsDone() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [diagnosticRequests, setDiagnosticRequests] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newDiagnosticRequest, setNewDiagnosticRequest] = useState({"date":null, "id":null})
  useEffect (() => {
    axios.get(`http://localhost:8000/api/user/diagnostic_requests_done/${decoded_token.user_id}`)
    .then(response => {
      console.log(response.data)
      setDiagnosticRequests(response.data)
      if(response.data.length != 0)
      setCheckTable(true)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])
  
  const handleState = (status) => {
    if(status === 'SUCCESSFULLY')
    {
      return 'Uspešno'
    }
    else
    {
      return 'Neuspešno'
    }
  }

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setNewDiagnosticRequest({...newDiagnosticRequest, [name]:val})
  }

  const initModal = (id) => {
    setShowModal(!showModal)
    setNewDiagnosticRequest({...newDiagnosticRequest, ["id"]:id})
  }

  const createNewDiagnosticRequest = () => {
    console.log(newDiagnosticRequest)
    axios.post('http://localhost:8000/api/user/diagnostic_request',
    {
      "date" : newDiagnosticRequest.date,
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
      <div style={{width:'70%', margin:'auto', marginTop:'100px' }}>
        {checkTable ?
      <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">Početak</th>
      <th scope="col">Kraj</th>
      <th scope="col">Uredjaj</th>
      <th scope="col">Pokvareni uredjaj</th>
      <th scope="col">Status</th>
      <th scope="col">Izveštaj</th>
    </tr>
  </thead>
  <tbody>
    {diagnosticRequests.map(dr => (
      <tr key={dr.id}>
        <th>{dr.diagnostic_request.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.diagnostic_request.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.diagnostic_request.device.name}</th>
        <th>{dr.broken_device}</th>
        <th>{handleState(dr.state)}</th>
        <th>{dr.state === 'SUCCESSFULLY' ? <Button>Uvid u izveštaj</Button>:<Button className="btn-danger" onClick={()=>initModal(dr.id)}>
          Ponovi zahtev</Button>}</th>
      </tr>
    ))}
    
  </tbody>
</table>:<div style={{width : '50%',
                    height : '200px',
                    margin : 'auto',
                marginTop : '150px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black',
                textAlign:'center',
                paddingTop:'30px'}}><h1>None of your diagnostic requests have been completed</h1></div>}
      </div>
    <Modal show={showModal}>
      <Modal.Header closeButton onClick={()=>setShowModal(!showModal)}>
        <Modal.Title>Kreiraj zahtev za dijagnostiku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Datum</Form.Label>
            <Form.Control type="datetime-local" name="date" value={newDiagnosticRequest.date} onChange={handleFormInputChange("date")} required={true} min={new Date().toISOString().slice(0, 16)}
            />
          </Form.Group>   
      <Button onClick={createNewDiagnosticRequest}>Potvrdi</Button>
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


export default DiagnosticRequestsDone