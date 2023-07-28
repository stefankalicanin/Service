import React from 'react'
import {TokenService} from '../../services/TokenService'
import UserProfile from '../User/UserProfile';
function HomeAdmin() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken());
  
  return (
    <div>
      <div className='row'>
        <div className='col-md-3'>
     <UserProfile/>
     </div>
     </div>
    </div>
  )
}

export default HomeAdmin