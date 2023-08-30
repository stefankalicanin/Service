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
  const [showModalReport, setShowModalReport] = useState(false)
  const [showModalRequest, setShowModalRequest] = useState(false)
  const [description, setDescription] = useState()
  const [troubleshootingRequest, setTroubleshootingRequest] = useState({
    "type" : null,
    "date" : null, 
    "id_diagnostic_report": null
  })
  const [validateResponse, setValidateResponse] = useState({})
  const [checkResponse, setCheckResponse] = useState(false)
  const [recommendedResponse, setRecommendedResponse] = useState(false)
  const [validateResponse1, setValidateResponse1] = useState({})
  const [checkResponse1, setCheckResponse1] = useState(false)
  const [recommendedResponse1, setRecommendedResponse1] = useState(false)
  const [newDiagnosticRequest, setNewDiagnosticRequest] = useState({
    "type_house" :null,
    "date" : null,
    "id_user": null,
    "id_device": null 
  })
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

  const initModalReport = (id) => {
    setShowModalReport(!showModalReport)
    const matchingDiagnosticRequest = diagnosticRequests.filter(dr => dr.id === id)
    const desc = matchingDiagnosticRequest.map(dr => dr.description)
    const under_warranty = matchingDiagnosticRequest.map(dr => dr.diagnostic_request.device.under_warranty)
    const type = under_warranty ? "popravka":"zamena"

    setDescription(desc)
    setTroubleshootingRequest({...troubleshootingRequest, ["type"]: type, ["id_diagnostic_report"]:id})
  }

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setTroubleshootingRequest({...troubleshootingRequest, ["date"]:val})
  }

  const createTroubleshootingRequest = () => {
    axios.post('http://localhost:8000/api/user/create_troubleshooting_request_repair',
    {"date":troubleshootingRequest.date})
    .then(response => {
      console.log(response.data)
      setValidateResponse(response.data)
      const answerData = response.data.start_time.slice(0,16)
      const sentData = troubleshootingRequest.date.replace('T', ' ')
      if (answerData != sentData)
      {
       setRecommendedResponse(true)
      }
      
      setCheckResponse(true)
     })
    .catch(error => {
      console.log(error)
    })
  }
const handleTypeHouse = (type) => {
  if (type === 'IN SERVICE') {
    return false
  }
  else {
    return true
  }
}
  const confirmTroubleshootingRequest = () => {
    axios.post('http://localhost:8000/api/user/save_troubleshooting_request_repair', troubleshootingRequest)
    .then(response => {
      console.log(response.data)
    })
    .catch(error=> {
      console.log(error)
    })
  }

  const initModalRequest = (id) => {
    setShowModalRequest(!showModalRequest)
    const matchingDiagnosticRequest = diagnosticRequests.filter(dr => dr.id === id)
    const id_device = matchingDiagnosticRequest.map(dr => dr.diagnostic_request.device.id)
    const type_house = matchingDiagnosticRequest.map(dr => dr.diagnostic_request.type_house)
    setNewDiagnosticRequest({...newDiagnosticRequest, ["id_device"]:id_device, ["type_house"]:handleTypeHouse(type_house)})
  }
  const handleFormInputChangeNewRequest = (name) => (event) => {
    const val = event.target.value;
    setNewDiagnosticRequest({...newDiagnosticRequest, [name]:val})
  }
const createNewDiagnosticRequest = () => {
  axios.post('http://localhost:8000/api/user/diagnostic_request',
  {
    "date":newDiagnosticRequest.date
  })
  .then(response => {
    console.log(response.data)
    setValidateResponse1(response.data)
      const answerData = response.data.start_time.slice(0,16)
      const sentData = newDiagnosticRequest.date.replace('T', ' ')
      if (answerData != sentData)
      {
       setRecommendedResponse1(true)
      }
      setCheckResponse1(true)
     
    
  })
  .catch(error => {
    console.log(error)
  })
}

const saveNewDiagnosticRequest = () => {
  axios.post('http://localhost:8000/api/user/diagnostic_request/save',
  {
    "type_house" : newDiagnosticRequest.type_house,
    "date" : newDiagnosticRequest.date,
    "id_user": decoded_token.user_id,
    "id_device": parseInt(newDiagnosticRequest.id_device)
  })
  .then(res => {
   console.log(res.data)
   setCheckResponse1(false)
   alert('Successfully created diagnostic request')
   window.location.reload()
  })
  .then(error => {
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
        <th>{dr.state === 'SUCCESSFULLY' ? <Button onClick={()=>initModalReport(dr.id)}>Uvid u izveštaj</Button>:
        <Button className="btn-danger" onClick={()=>initModalRequest(dr.id)}>
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
    <Modal show={showModalRequest}>
      <Modal.Header closeButton onClick={()=>setShowModalRequest(!showModalRequest)}>
        <Modal.Title>Kreiraj zahtev za dijagnostiku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Datum</Form.Label>
            <Form.Control type="datetime-local" name="date" value={newDiagnosticRequest.date} onChange={handleFormInputChangeNewRequest("date")}/>
          </Form.Group>   
      <Button onClick={createNewDiagnosticRequest}>Potvrdi</Button>
      {checkResponse1  && 
        <div style={{marginLeft:'110px'}}>
          {recommendedResponse1 && <p>Izabrani termin je zauzet.Preporučeni termin:</p>}
          <p><strong>Početak:</strong> {validateResponse1.start_time.slice(0,19)}</p>
          <p><strong>Kraj:</strong>{validateResponse1.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={saveNewDiagnosticRequest}>Prihvati</Button>
          <Button variant="danger" style={{marginLeft:'70px'}}>Odbij</Button></div>
      }      </Modal.Body>
      <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModalRequest(!showModalRequest)}>
            Zatvori
          </Button>
        </Modal.Footer>
    </Modal>
      <Modal show={showModalReport}>
        <Modal.Header closeButton onClick={()=>setShowModalReport(!showModalReport)}>
          <Modal.Title>Uvid u izveštaj</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Opis kvara:</h3>
          <strong><p>{description}</p></strong>
          <p>Preporuka servisera: <strong>{troubleshootingRequest.type}.</strong></p>
          <p>Dijagnostika je <strong>uspešno</strong> obavljena. Molimo unesite željeni datum za popravku uredjaja.</p>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Datum</Form.Label>
            <Form.Control type="datetime-local" name="date" value={troubleshootingRequest.date} onChange={handleFormInputChange("date")} min={new Date().toISOString().slice(0, 16)}/>
          </Form.Group>  
         <Button onClick={createTroubleshootingRequest}>Potvrdi</Button> 
         {checkResponse  && 
        <div style={{marginLeft:'110px'}}>
          {recommendedResponse && <p>Izabrani termin je zauzet.Preporučeni termin:</p>}
          <p><strong>Početak:</strong> {validateResponse.start_time.slice(0,19)}</p>
          <p><strong>Kraj:</strong>{validateResponse.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={confirmTroubleshootingRequest}>Prihvati</Button>
          <Button variant="danger" style={{marginLeft:'70px'}}>Odbij</Button>
        </div>}  
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModalReport(!showModalReport)}>Zatvori</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}


export default DiagnosticRequestsDone