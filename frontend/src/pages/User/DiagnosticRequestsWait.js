import {React, useEffect, useState} from 'react'
import axios from 'axios'
import { TokenService } from '../../services/TokenService'

function DiagnosticRequestsWait() {
  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [diagnosticRequests, setDiagnosticRequests] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  useEffect (() => {
    axios.get(`http://localhost:8000/api/user/diagnostic_request_wait/${decoded_token.user_id}`)
    .then(response => {
      console.log(response.data)
      setDiagnosticRequests(response.data)
      if(response.data.length != 0)
      {
        setCheckTable(true)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [])
  return (
      <div style={{width:'80%', margin:'auto', marginTop:'100px' }}>
        {checkTable ? 
        <div>
         <h1 style={{marginLeft:'250px', marginBottom:'50px'}}>Zahtevi za dijagnostiku - na čekanju</h1> 
      <table class="table table-dark" style={{width:'100%'}}>
  <thead>
    <tr>
      <th scope="col">Početak</th>
      <th scope="col">Kraj</th>
      <th scope="col">Uredjaj</th>
      <th scope="col">Serviser</th>
    </tr>
  </thead>
  <tbody>
    {diagnosticRequests.map(dr => (
      <tr key={dr.id}>
        <th>{dr.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{dr.device.name}</th>
        <th>{dr.schedule_appointment.repairer_profile.user.first_name} {dr.schedule_appointment.repairer_profile.user.last_name} </th>
      </tr>
    ))}
    
  </tbody>
</table></div>:<div style={{width : '50%',
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
      </div>
    
  )
}

export default DiagnosticRequestsWait