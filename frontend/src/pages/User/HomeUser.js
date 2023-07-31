import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import axios from 'axios'
import UserProfile from './UserProfile';
import UserDiagnosticRequest from './UserDiagnosticRequest';
import photo from '../Home/img/photoHome.jpg'
function HomeUser() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  
  return (
    <div>
    <div className='row' style={{margin:'auto'}}>
  <div className='col-md-3'>
    <UserProfile />
  </div>
  <div className='col-md-6' style={{marginLeft:'200px', marginTop:'10px'}}>
    <UserDiagnosticRequest />
  </div>
</div>
</div>
      )}


export default HomeUser