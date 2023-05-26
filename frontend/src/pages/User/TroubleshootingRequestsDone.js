import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
function TroubleshootingRequestsDone() {
  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
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
  return (
    <div>
       <div style={{width:'70%', margin:'auto', marginTop:'100px' }}>
        {checkTable ? 
      <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Type</th>
      <th scope="col">Start time</th>
      <th scope="col">End time</th>
      <th scope="col">Device</th>
    </tr>
  </thead>
  <tbody>
    {troubleshooting.map(tr => (
      <tr key={tr.id}>
        <th>{tr.date.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.type}</th>
        <th>{tr.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tr.diagnostic_request.device.name}</th>
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
      </div>
    </div>
  )
}

export default TroubleshootingRequestsDone