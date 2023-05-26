import {React, useState, useEffect, isValidElement} from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {TokenService} from '../../services/TokenService'

function UserDiagnosticRequest() {
  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const[category, setCategory] = useState([])
  const[device, setDevice] = useState([])
  const[category_size, setCategorySize] = useState(true)
  const[isChecked, setIsChecked] = useState(false)
  const [response, setResponse] = useState({})
  const [validateResponse, setValidateResponse] = useState({})
  const [checkResponse, setCheckResponse] = useState(false)
  const [recommendedResponse, setRecommendedResponse] = useState(false)
  const[diagnosticRequest, setDiagnosticRequest] = useState({
    "type_house" :null,
    "date" : null,
    "id_user": null,
    "id_device": null 
  })

  useEffect(() =>
  {
    axios.get('http://localhost:8000/api/user/all_categories')
    .then(response => {
      setCategory(response.data)
    })
    .then(error => {
      console.log(error)
    })
  }, [])

  const chooseCategory = (e) => {
    const index = e.target.selectedIndex
    const el = e.target.childNodes[index]
    const id = el.getAttribute('id')
    axios.get(`http://localhost:8000/api/user/category/${id}`)
    .then(response => {
      setCategorySize(response.data.big_size)
    })
    .then(error => {
      console.log(error)
    })
      axios.get(`http://localhost:8000/api/user/all_device_by_category/${id}`)
      .then(response => {
        setDevice(response.data)
      })
      .then(error => {
        console.log(error)
      })
  }

  const chooseDevice = (e) => {
    const index = e.target.selectedIndex
    const el = e.target.childNodes[index]
    const id = el.getAttribute('id')
    setDiagnosticRequest({...diagnosticRequest, ["id_device"] : id})
  }

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setDiagnosticRequest({...diagnosticRequest, [name] : val})
  }

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked)
  }

  const sendRequest = () => {
    axios.post('http://localhost:8000/api/user/diagnostic_request',
    {
      "date" : diagnosticRequest.date,
    })
    .then(res => {
     console.log(res.data)
     setValidateResponse(res.data)
     const answerData = res.data.start_time.slice(0,16)
     const sentData = diagnosticRequest.date.replace('T', ' ')
     if (answerData != sentData)
     {
      setRecommendedResponse(true)
     }
     
     setCheckResponse(true)
    })
    .then(error => {
      console.log(error)
    })
  }

  const confirmRequest = () => {
    axios.post('http://localhost:8000/api/user/diagnostic_request/save',
    {
      "type_house" : isChecked,
      "date" : diagnosticRequest.date,
      "id_user": decoded_token.user_id,
      "id_device": diagnosticRequest.id_device
    })
    .then(res => {
     console.log(res.data)
     setResponse(res.data)
     setCheckResponse(false)
     alert('Successfully created diagnostic request')
     window.location.assign('/user/diagnostic_request')
    })
    .then(error => {
      console.log(error)
    })
  }

  const refuseRequest = () => {
    setCheckResponse(false)
  }
  return (
    <div>
      <div style= {{marginTop: '100px'
                  }}>
      <div style={{width : '40%',
                    margin : 'auto',
                    textAlign : 'center'
                 }}>
        <h3>Create diagnostic request</h3>
      </div>
      <div style={{width : '40%',
                    margin : 'auto',
                    marginTop : '50px'
                 }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <select className="form-select" aria-label="Default select example" onChange={chooseCategory} required={true}>
              <option selected>Choose category</option>
              {category.map(c => 
              <option id = {c.id}>{c.name}</option>
              )}
            </select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <select className="form-select" aria-label="Default select example" onChange={chooseDevice} required={true}>
              <option selected>Choose device</option>
              {device.map(d => 
              <option id = {d.id}>{d.name}</option>
              )}
            </select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="datetime-local" name="date" value={diagnosticRequest.date} onChange={handleFormInputChange("date")} required={true}/>
          </Form.Group>    
        </Form>
        {!category_size &&   
        <Form.Group className="mb-3"  controlId="formBasicCheckbox">
          <Form.Check type="checkbox"  label="House diagnostic" checked={isChecked} onChange={handleCheckBoxChange}/>
        </Form.Group>}
        <Button variant="primary" onClick={sendRequest}>Submit</Button>
        {checkResponse  && 
        <div style={{marginTop: '10px', border: '1px solid red'}}>
          {recommendedResponse && <p>The appointment is taken.Recommended appointment:</p>}
          <p>Start time: {validateResponse.start_time.slice(0,19)}</p>
          <p>End time: {validateResponse.end_time.slice(0,19)}</p>
          <Button variant="primary" onClick={confirmRequest}>Accept</Button>
          <Button variant="danger" onClick={refuseRequest}>Refuse</Button>
        </div>} 
      </div>
    </div>
    </div>
  )
}

export default UserDiagnosticRequest
