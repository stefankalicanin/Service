import React from 'react'
import {TokenService} from '../../services/TokenService'
import RepairDiagnosticAppointment from './RepairDiagnosticAppointments'

function HomeRepaird() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken());

  return (
    <div>
     <RepairDiagnosticAppointment/> 
    </div>
  )
}

export default HomeRepaird