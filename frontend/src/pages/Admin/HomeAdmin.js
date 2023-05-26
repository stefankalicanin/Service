import React from 'react'
import {TokenService} from '../../services/TokenService'

function HomeAdmin() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken());
  
  return (
    <div>
      Welcome to Admin page, {decoded_token.username}
    </div>
  )
}

export default HomeAdmin