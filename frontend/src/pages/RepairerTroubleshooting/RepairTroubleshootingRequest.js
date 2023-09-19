import {React, useEffect, useState} from 'react'
import axios from 'axios'
import { TokenService } from '../../services/TokenService'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function RepairTroubleshootingRequest() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [check, setCheck] = useState(false)
  const [troubleshootingDone, setTroubleshootingDone] = useState({
    id:null,
    description:""
  })
  useEffect(() => {
    axios.get(`http://localhost:8000/api/repairer/profile/${decoded_token.user_id}`)
    .then(response => {
      const id = response.data.id
      axios.get(`http://localhost:8000/api/repairer/get_troubleshooting_request_by_repairer/${id}`)
      .then(response => {
        console.log(response.data)
        setTroubleshooting(response.data)
        if(response.data.length != 0)
        {
          setCheckTable(true)
        }
      })
    })
    .then(error => {
      console.log(error)
    })
   }, [])

   const initModal = (id) => {
    setShowModal(!showModal)
    setTroubleshootingDone({...troubleshootingDone, "id":id})
   }

   const handleType = (type) => {
    if (type === 'REPLACE') {
      return 'Zamena';
    }
    else {
      return 'Popravka'
    }
   }

   const handleCheckBoxChange = () => {
    setCheck(!check)
   }

   const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setTroubleshootingDone({...troubleshootingDone, [name]:val})
   }
   const saveTroubleshooting = () => {
    axios.post(`http://localhost:8000/api/repairer/troubleshooting/done/${troubleshootingDone.id}`)
    .then(res => {
      console.log(res)

    })
    .catch(error => {
      console.log(error)
    })
    axios.post('http://localhost:8000/api/repairer/troubleshooting_report', {
      "id":troubleshootingDone.id,
      "state":check,
      "description":troubleshootingDone.description
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(error => {
      console.log(error)
    })
   }

   const createTravelWarrant = (id) => {
    axios.post('http://localhost:8000/api/repairert/travel_warrant_request',
    {
      "id":id
    }
    )
    .then(response => {
      console.log(response)
      window.location.reload()
    })
    .catch(error => {
      console.log(error)
    })
   }

   const handleUnapprovedTravelWarrant = (id) => {
    axios.post(`http://localhost:8000/api/repairert/update_troubleshooting_schedule_appointment_done/${id}`)
    .then(response => {
     console.log(response.data)
     window.location.reload()
    })
    .then(error => {
      console.log(error)
    })
   }
  return (
    <div>
      {checkTable ? <div style={{
                    marginTop : '120px',
                    marginLeft:'150px',
                    width:'100%'
                }}>
      <h2 style={{marginBottom:'30px', marginLeft:'90px'}}>Pregled zahteva za popravku uredjaja</h2>
      <table className='table table-dark'>
        <thead>
         <tr>
          <th scope='col'>Početak</th>
          <th scope='col'>Kraj</th>
          <th scope='col'>Uredjaj</th>
          <th scope='col'>Pokvareni uredjaj</th>
          <th scope='col'>Tip</th>
          <th>Potvrdi</th>
        </tr> 
        </thead>
        <tbody>
          {troubleshooting.map(t => (
            <tr key={t.id}>
              <th>{t.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
              <th>{t.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
              <th>{t.diagnostic_report.diagnostic_request.device.name}</th>
              <th>{t.diagnostic_report.broken_device}</th>
              <th>{handleType(t.type)} uredjaja</th>
              <th>{(t.diagnostic_report.diagnostic_request.type_house === 'IN SERVICE' && t.state === 'INITIAL') || (t.diagnostic_report.diagnostic_request.type_house === 'IN SERVICE' && t.state === 'PROCESSED') || (t.diagnostic_report.diagnostic_request.type_house === 'HOUSE' && t.state === 'PROCESSED') ? <Button onClick={()=>initModal(t.id)}>Napiši izveštaj</Button>
      :(t.diagnostic_report.diagnostic_request.type_house === 'HOUSE' && t.state === 'INITIAL') ? <Button className="btn-danger" onClick={()=>createTravelWarrant(t.schedule_appointment.id)}>Putni nalog</Button>
      :(t.diagnostic_report.diagnostic_request.type_house === 'HOUSE' && t.state === 'PROCESSING') ? <Button className="btn-danger" disabled={true}>Odobravanje putnog naloga</Button>
      :(t.diagnostic_report.diagnostic_request.type_house === 'HOUSE' && t.state === 'UNPROCESSED') ? <div><p>Putni nalog nije odobren</p><Button className="btn-danger" onClick={()=>handleUnapprovedTravelWarrant(t.id)}>Obavesti korisnika</Button></div>:null}</th>
            </tr>
          ))}
        </tbody>
      </table>
      </div>:<div style={{width : '50%',
                    height : '200px',
                    margin : 'auto',
                marginTop : '150px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black',
                textAlign:'center',
                paddingTop:'40px'}}><h1>
               All your diagnostic requests have been processed
</h1></div>}
      <Modal show={showModal}>
        <Modal.Header closeButton onClick={()=>setShowModal(!showModal)}>
          <Modal.Title>Pregled zahteva za popravkom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" placeholder="Unesite opis popravke..." name="description" value={troubleshootingDone.description} onChange={handleFormInputChange("description")}
                    />
                </Form.Group>
        <Form.Group className="mb-3"  controlId="formBasicCheckbox" checked={check} onChange={handleCheckBoxChange}>
          <Form.Check type="checkbox"  label="Uspešno obavljena popravka" />
        </Form.Group>
        <Button onClick={saveTroubleshooting}>Potvrdi</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={()=>setShowModal(!showModal)}>Zatvori</Button>
          </Modal.Footer>
      </Modal>
    </div>
)}
export default RepairTroubleshootingRequest;