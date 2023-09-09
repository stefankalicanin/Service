import React, { useEffect, useState } from 'react'
import { TokenService } from '../../services/TokenService'
import axios from 'axios'

function UnnaprovedTravelWarrant() {

    const decoded_token = TokenService.decodeToken(TokenService.getToken())
    const [travelWarrant, setTrawelWarrant] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/travelwarrant/${decoded_token.user_id}`)
        .then(response => {
            console.log(response.data)
            setTrawelWarrant(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])
    
  return (
    <div>
        <div style={{width:'80%', margin:'auto', marginTop:'100px' }}>
        <div>
         <h1 style={{marginLeft:'350px', marginBottom:'50px'}}>Neodobreni putni nalozi</h1> 
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
    {travelWarrant.map(tw => (
      <tr key={tw.id}>
        <th>{tw.schedule_appointment.start_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tw.schedule_appointment.end_time.replace('T', ' ').replace('Z', '')}</th>
        <th>{tw.device.name}</th>
        <th>{tw.schedule_appointment.repairer_profile.user.first_name} {tw.schedule_appointment.repairer_profile.user.last_name} </th>
      </tr>
    ))}
    
  </tbody>
</table>
    </div>
    </div>
    </div>
  )
}

export default UnnaprovedTravelWarrant