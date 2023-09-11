import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import Button from 'react-bootstrap/Button';

function TroubleshootingRequestsDone() {
  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const [troubleshooting, setTroubleshooting] = useState([])
  const [checkTable, setCheckTable] = useState(false)
  const [pdf, setPdf] = useState()

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
        <th><Button onClick={()=> createReport(tr.id)}>Report</Button></th>
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