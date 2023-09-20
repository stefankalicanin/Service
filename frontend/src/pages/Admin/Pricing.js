import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function Pricing() {
    
  const [troubleshootingData, setTroubleshootingData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [troubleshootingModalData, setTroubleshootingModalData] = useState([])
  const [pricing, setPricing] = useState({
    "price" : null,
    "schedule_appointment_id":null,
    "client_id":null
  })

    useEffect(()=> {
        axios.get('http://localhost:8000/api/admin/pricing/all')
        .then(response => {
            console.log(response.data)
            setTroubleshootingData(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const detailsAboutTroubleshooting = (id_troubleshooting) => {
      setShowModal(!showModal)
      const matchedTroubleshooting = troubleshootingData.filter((t) => t.id === id_troubleshooting)
      setTroubleshootingModalData(matchedTroubleshooting)
      console.log(matchedTroubleshooting)
      const schedule_appointment_id = matchedTroubleshooting.map(mt => mt.troubleshooting.schedule_appointment.id)[0]
      const client_id = matchedTroubleshooting.map(mt => mt.troubleshooting.diagnostic_report.diagnostic_request.client.id)[0]
      setPricing({...pricing, "schedule_appointment_id" : parseInt(schedule_appointment_id), 
      "client_id" : parseInt(client_id)})

    }

    const handleFormInputChange = (name) => (event) => {
      const val = event.target.value;
      setPricing({...pricing, [name]:val})
      console.log(pricing)
    }

    const createPrice = () => {
      axios.post('http://localhost:8000/api/admin/pricing/create', pricing)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
    }

  return (
    <div>
      <div>
        <table className='table table-dark'>
          <thead>
            <tr>
              <th>Uredjaj za dijagnostiku</th>
              <th>Kategorija uredjaja</th>
              <th>Pokvaren uredjaj</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {troubleshootingData.map(td => (
              <tr key = {td.id}>
                <th>{td.troubleshooting.diagnostic_report.diagnostic_request.device.name}</th>
                <th>{td.troubleshooting.diagnostic_report.diagnostic_request.device.category.name}</th>
                <th>{td.troubleshooting.diagnostic_report.broken_device}</th>
                <th><Button onClick={()=>detailsAboutTroubleshooting(td.id)}>Više detalja</Button></th>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal show={showModal}>
          <Modal.Header closeButton onClick={()=>setShowModal(!showModal)}>
            <Modal.Title>Detalji o popravci</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {troubleshootingModalData.map(tmd => (
              <div>
              <h3>Podaci o korisniku koji je zahtevao uslugu servisa</h3>
              <p><strong>Ime:</strong> {tmd.troubleshooting.diagnostic_report.diagnostic_request.client.user.first_name}</p>
              <p><strong>Prezime:</strong> {tmd.troubleshooting.diagnostic_report.diagnostic_request.client.user.last_name}</p>
              <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Cena usluge:</Form.Label>
                    <Form.Control type="number" min='1' name="price" value={pricing.price} onChange={handleFormInputChange("price")}/>
                </Form.Group>
                <Button onClick={createPrice}>Kreiraj cenu</Button>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={()=>setShowModal(!showModal)}>Zatvori</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default Pricing