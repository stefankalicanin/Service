import {Children, React, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import Form from 'react-bootstrap/Form'

function DiagnosticRequestsDone() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [diagnosticRequests, setDiagnosticRequests] = useState([])
  const [showModalRepair, setShowModalRepair] = useState(false)
  const [showModalReplace, setShowModalReplace] = useState(false)
  const [troubleshootingRepair, setTroubleshootingRepair] = useState({})
  const [responseDate, setResponseDate] = useState({})
  const [recommendedDate, setRecommendedDate] = useState(false)
  const [checkResponse, setCheckResponse] = useState(false)
  const [checkTable, setCheckTable] = useState(false)
  const [reportDataRepair, setReportDataRepair] = useState({})
  const [reportDataReplace, setReportDataReplace] = useState({})
  const [checkOrder, setCheckOrder] = useState(false)
  const [type, setType] = useState(false)
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
  
  const initModalRepair = (diagnostic_report) => {
    setReportDataRepair({...reportDataRepair, ["description"]:diagnostic_report.description, ["device"]:diagnostic_report.device.name})
    console.log(diagnostic_report)
    setTroubleshootingRepair({...troubleshootingRepair, ["id"] : diagnostic_report.diagnostic_request.id})
    setType(false)
    return setShowModalRepair(!showModalRepair)
  }

  const initModalReplace = (diagnostic_report) => {
    setTroubleshootingRepair({...troubleshootingRepair, ["id"] : diagnostic_report.diagnostic_request.id})
    axios.get(`http://localhost:8000/api/user/order/device/${diagnostic_report.device.id}`)
    .then(res=> {
     console.log(res)
     
      setReportDataReplace({...reportDataReplace, ["description"]:diagnostic_report.description, ["device"]:diagnostic_report.device.name,
    ["date"]:res.data.date})
    if(res.data !='')
    {
    setCheckOrder(true)
  }
  else
  {
    setCheckOrder(false)
  }
      
    })
    .catch(error => {
      console.log(error)
    })
    setType(true)
    return setShowModalReplace(!showModalReplace)
    
  }
  const handleDate = (name) => (event) =>{
    const val = event.target.value
    setTroubleshootingRepair({...troubleshootingRepair, [name] : val})
  }

  const sendTroubleshootingRepairRequest = () => {
    axios.post('http://localhost:8000/api/user/create_troubleshooting_request_repair',
    {
      "id" : troubleshootingRepair.id,
      "date" : troubleshootingRepair.date
    })
    .then(response => {
      console.log(response.data)
      setResponseDate(response.data)
      const answerData = response.data.start_time.slice(0,16)
      const sentData = troubleshootingRepair.date.replace('T', ' ')
      if (answerData != sentData)
      {
        setRecommendedDate(true)
      }
    
      setCheckResponse(true)
      console.log(recommendedDate)
      console.log(checkResponse)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const confirmRequest = () => {
    axios.post('http://localhost:8000/api/user/save_troubleshooting_request_repair',
    {
      "id" : troubleshootingRepair.id,
      "date" : troubleshootingRepair.date,
      "type" : type
    })
    .then(response => {
      console.log(response.data)
      setCheckResponse(false)
      alert("Successfully created request")
      setShowModalRepair(!showModalRepair)
      window.location.assign('/user/diagnostic_requests/done')
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
      <th scope="col">Date</th>
      <th scope="col">Start time</th>
      <th scope="col">End time</th>
      <th scope="col">Device</th>
      <th>Price</th>
      <th>Report</th>
    </tr>
  </thead>
  <tbody>
    {diagnosticRequests.map(dr => (
      <tr key={dr.id}>
        <th>{dr.diagnostic_request.date.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.diagnostic_request.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.diagnostic_request.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.diagnostic_request.device.name}</th>
        <th>{dr.price.price}</th>
        <th>{dr.diagnostic_request.device.under_warranty ? <Button variant="success" onClick={() => initModalRepair(dr)}>Report</Button>
        :<Button variant="success" onClick={() => initModalReplace(dr)}>Report</Button>}
        </th>
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
      <Modal show={showModalRepair}>
        <Modal.Header closeButton onClick={()=> setShowModalRepair(!showModalRepair)}>
          <Modal.Title>Diagnostic request report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3>Service recommendation: REPAIR.</h3>
        <h3>Description:{reportDataRepair.description}</h3>
        <h3>The {reportDataRepair.device}  needs to be repaired.</h3>
        <p>Please select the date you would like the repair.</p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="datetime-local" name="date" value={troubleshootingRepair.date} onChange={handleDate("date")}/>
          </Form.Group>
        </Form> 
        <Button onClick={sendTroubleshootingRepairRequest}>Create request</Button> 
          {checkResponse && <div>
          {recommendedDate && <p>The appointment is taken.Recommended appointment:</p>}
          <p>Start time: {responseDate.start_time.slice(0,19)}</p>
          <p>End time: {responseDate.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={confirmRequest}>Accept</Button>
          <Button variant="danger" >Refuse</Button>
          </div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() =>  setShowModalRepair(!showModalRepair)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalReplace}>
        <Modal.Header closeButton onClick={()=> setShowModalReplace(!showModalReplace)}>
          <Modal.Title>Diagnostic request report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Service recommendation: <h3>REPLACE</h3></p>
        <p>Description:<h3>{reportDataReplace.description}</h3></p>
        <p>The <h3>{reportDataReplace.device}</h3>needs to be replaced.</p>
       {checkOrder && <p>We currently do not have a device in stock. The device is arriving:<h3>{reportDataReplace.date.replace('T', ' ').replace('Z', '')}</h3></p>}
        <p>Please select the date you would like the replaced.</p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
           {checkOrder ?  <Form.Control type="datetime-local" name="date"  min={reportDataReplace.date.slice(0,16)} value={troubleshootingRepair.date} onChange={handleDate("date")}/>
           :<Form.Control type="datetime-local" name="date"   value={troubleshootingRepair.date} onChange={handleDate("date")}/>}
          </Form.Group>
        </Form> 
        <Button onClick={sendTroubleshootingRepairRequest}>Create request</Button> 
          {checkResponse && <div>
          {recommendedDate && <p>The appointment is taken.Recommended appointment:</p>}
          <p>Start time: {responseDate.start_time.slice(0,19)}</p>
          <p>End time: {responseDate.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={confirmRequest}>Accept</Button>
          <Button variant="danger" >Refuse</Button>
          </div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=> setShowModalReplace(!showModalReplace)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}


export default DiagnosticRequestsDone