import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import UserProfile from './UserProfile';
import UserDiagnosticRequest from './UserDiagnosticRequest';

function HomeUser() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  
  return (
    <div>
    <div className='row' style={{margin:'auto'}}>
  <div className='col-md-3'>
    <UserProfile />
  </div>
  <div className='col-md-6' style={{marginLeft:'220px', marginTop:'50px'}}>
    <UserDiagnosticRequest />
  </div>
</div>
</div>
      )}


export default HomeUser