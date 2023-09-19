import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function TroubleshootingRequestsDone() {
  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  const [pdf, setPdf] = useState()
  const [showModal, setShowModal] = useState(false)
  const [troubleshootingRequest, setTroubleshootingRequest] = useState({"date":null, "id_troubleshooting":null, "type":null, "id_diagnostic_report":null})
  const [validateResponse, setValidateResponse] = useState({})
  const [checkResponse, setCheckResponse] = useState(false)
  const [recommendedResponse, setRecommendedResponse] = useState(false)
  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/troubleshooting_request_done/${decoded_token.user_id}`)
    .then(res => {
      console.log(res.data)
      setTroubleshooting(res.data)
      if(res.data.length != 0)
      {
        setCheckTable(true)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  const createReport = (troubleshooting_id) => {
    axios
      .get(`http://localhost:8000/api/user/report/${troubleshooting_id}`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const pdfData = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, '_blank');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const initModal = (troubleshooting) => {
    setShowModal(!showModal)
    setTroubleshootingRequest({...troubleshootingRequest, "id_troubleshooting":troubleshooting.id,
     "type":troubleshooting.troubleshooting.diagnostic_report.diagnostic_request.device.under_warranty ? 'zamena':'popravka',
    "id_diagnostic_report":troubleshooting.troubleshooting.diagnostic_report.id})
  }

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setTroubleshootingRequest({...troubleshootingRequest, [name]:val})
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

  const refuseRequest = () => {
    setCheckResponse(false)
    setRecommendedResponse(false)
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
      <th scope="col">popravljeni uredjaj</th>
      <th scope="col">Report</th>
    </tr>
  </thead>
  <tbody>
    {troubleshooting.map(tr => (
      <tr key={tr.id}>
        <th>{tr.troubleshooting.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.troubleshooting.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.troubleshooting.diagnostic_report.diagnostic_request.device.name}</th>
        <th>{tr.troubleshooting.diagnostic_report.broken_device}</th>
        <th>{tr.state === 'SUCCESSFULLY' ? <Button>Uvid u izveštaj</Button>:<Button className='btn-danger' onClick={()=>initModal(tr)}>Ponovi zahtev</Button>}</th>
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
                paddingTop:'30px'}}><h1>
               None of your troubleshooting requests have been completed
</h1></div> }
<Modal show={showModal}>
        <Modal.Header closeButton onClick={()=>setShowModal(!showModal)}>
          <Modal.Title>Kreiranje zahteva za popravkom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Datum</Form.Label>
            <Form.Control type="datetime-local" name="date"  value={troubleshootingRequest.date} onChange={handleFormInputChange("date")} />
          </Form.Group>  
         <Button onClick={createTroubleshootingRequest}>Potvrdi</Button>
         {checkResponse  && 
        <div style={{marginLeft:'110px'}}>
          {recommendedResponse && <p>Izabrani termin je zauzet.Preporučeni termin:</p>}
          <p><strong>Početak:</strong> {validateResponse.start_time.slice(0,19)}</p>
          <p><strong>Kraj:</strong> {validateResponse.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={confirmTroubleshootingRequest}>Prihvati</Button>
          <Button variant="danger" onClick={refuseRequest} style={{marginLeft:'70px'}}>Odbij</Button>
        </div>}  
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModal(!showModal)}>Zatvori</Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  )
}

export default TroubleshootingRequestsDone