import {React, useEffect} from 'react'
import RepairTroubleshootingRequest from './RepairTroubleshootingRequest'
import UserProfile from '../User/UserProfile'
import { TokenService } from '../../services/TokenService'
import axios from 'axios'
function HomeRepairt() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  

  return (
    <div>
       <div className='row' style={{margin:'auto'}}>
  <div className='col-md-3'>
    <UserProfile />
  </div>
  <div className='col-md-6'>
      <RepairTroubleshootingRequest/>
      </div>
    </div>
   </div> 
  )
}

export default HomeRepairt