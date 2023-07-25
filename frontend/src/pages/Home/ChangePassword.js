import React, { useState } from 'react'
import { TokenService } from '../../services/TokenService'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { AuthenticationService } from '../../services/AuthenticationService';

function ChangePassword() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const role = AuthenticationService.getRole()
 
  if (role === 'USER' || role === 'ADMIN')
  {
    AuthenticationService.logout();
  }
  const [user, setUser] = useState({
    password : '',
    confirmPassword : '',
    username : decoded_token.username
  })
  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setUser({...user, [name] : val})
  };

  const changePassword = () => {
    axios.post('http://localhost:8000/api/repairer/password',
    {
      username : user.username,
      password : user.password
    })
  }

  return (
    <div>
    <div style = {{
        textAlign : 'center'
    }}>
        
    </div> 
        <div style={{width : '30%',
                    height : '400px',
                    margin : 'auto',
                marginTop : '150px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black'}}>
                    <h1 style={{paddingLeft:'175px',paddingTop:'40px',backgroundColor:'#ffffff8c',borderRadius:'25px'
                    }}>Change password</h1>
            <Form style={{padding:'30px',
                        paddingTop:'50px'}}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="text" placeholder="Enter password" name="password" value={user.password} onChange={handleFormInputChange("password")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" name="confirmPassword" value={user.confirmPassword} onChange={handleFormInputChange("confirmPassword")}/>
                </Form.Group>
                <Button variant="primary" onClick={changePassword}>
                    Submit
                </Button>
             </Form>
        </div>
    </div>
  )
  }

export default ChangePassword