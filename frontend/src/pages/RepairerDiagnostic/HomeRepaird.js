import React from 'react'
import {TokenService} from '../../services/TokenService'
import RepairDiagnosticAppointment from './RepairDiagnosticAppointments'
import UserProfile from '../User/UserProfile'
function HomeRepaird() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken());

  return (
    <div>
    <div className='row'>
      <div className='col-md-3'>
        <UserProfile/>
      </div>
      <div className='col-md-8'>
       <RepairDiagnosticAppointment/> 
      </div>
    </div>
    </div>
  )
}

export default HomeRepaird