import {React, useEffect, useState} from 'react'
import axios from 'axios'
import { TokenService } from '../../services/TokenService'
import Button from 'react-bootstrap/Button'
function RepairTroubleshootingRequest() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
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

   const troubleshootingRepair = (id) => {
    axios.post(`http://localhost:8000/api/repairer/troubleshooting/done/${id}`)
    .then(res => {
      console.log(res)
      window.location.assign('/repairert/home')
    })
    .catch(error => {
      console.log(error)
    })
   }

  return (
    <div>
      {checkTable ? <div style={{width : '70%',
                    margin : 'auto',
                    marginTop : '100px'
                }}>
      <table className='table table-dark'>
        <thead>
         <tr>
          <th scope='col'>Start time</th>
          <th scope='col'>End time</th>
          <th scope='col'>Device</th>
          <th scope='col'>Type</th>
          <th>Confirm</th>
        </tr> 
        </thead>
        <tbody>
          {troubleshooting.map(t => (
            <tr key={t.id}>
              <th>{t.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
              <th>{t.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
              <th>{t.diagnostic_request.device.name}</th>
              <th>{t.type}</th>
              <th><Button  variant="success" onClick={() => troubleshootingRepair(t.id)}>Confirm</Button></th>
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
    </div>
)}
export default RepairTroubleshootingRequest;