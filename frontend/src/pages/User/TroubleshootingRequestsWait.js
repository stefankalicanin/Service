import {React, useState, useEffect} from 'react'
import { TokenService } from '../../services/TokenService'
import axios from 'axios'
function TroubleshootingRequestsWait() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/troubleshooting_request_wait/${decoded_token.user_id}`)
    .then(res => {
      console.log(res.data)
      setTroubleshooting(res.data)
      if(res.data.length != 0) {
        setCheckTable(true)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [])
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
    </tr>
  </thead>
  <tbody>
    {troubleshooting.map(tr => (
      <tr key={tr.id}>
        <th>{tr.diagnostic_report.diagnostic_request.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.diagnostic_report.diagnostic_request.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.diagnostic_report.diagnostic_request.device.name}</th>
        <th>{tr.diagnostic_report.broken_device}</th>
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
                All your troubleshooting requests have been processed
</h1></div>}
      </div>
    </div>
  )
}

export default TroubleshootingRequestsWait