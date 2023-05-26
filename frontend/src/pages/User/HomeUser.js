import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import UserDiagnosticRequest from './UserDiagnosticRequest';
import axios from 'axios'
import Button from 'react-bootstrap/Button';

function HomeUser() {

  return (
  <div>
    <UserDiagnosticRequest/>
 </div> 
      )}


export default HomeUser