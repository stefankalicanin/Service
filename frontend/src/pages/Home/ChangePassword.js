import React, { useState } from 'react'
import { TokenService } from '../../services/TokenService'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'

function ChangePassword() {

  const decoded_token = TokenService.decodeToken(TokenService.getToken())
  const username = decoded_token.username;

  const [user, setUser] = useState({
    password : '',
    confirmPassword : '',
    username : username
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState()

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setUser({...user, [name] : val})
    
  };

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const changePassword = () => {
    if (user.password !== user.confirmPassword) {
      setError(true)
      return;
    }
    else {
      setError(false)
    axios.post('http://localhost:8000/api/repairer/password',
    {
      username : user.username,
      password : user.password
    })
    .then(res => {
      TokenService.removeToken();
      window.location.assign("/login")
    })
    .catch(error => {
      console.log(error)
    })
  }
  }

  const buttonText = showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku';

  return (
    <div>
    <div style = {{
        textAlign : 'center'
    }}>
        
    </div> 
        <div style={{width : '50%',
                    height : '400px',
                    margin : 'auto',
                marginTop : '150px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black'}}>
                    <h1 style={{backgroundColor:'#ffffff8c',borderRadius:'25px', textAlign:'center'
                    }}>Promena lozinke</h1>
            <Form style={{padding:'30px',
                        paddingTop:'50px'}}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Nova lozinka</Form.Label>
                    <Form.Control type={showPassword ? "text":"password"} placeholder="Enter password" name="password" value={user.password} onChange={handleFormInputChange("password")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Potvrdite novu lozinku</Form.Label>
                    <Form.Control type={showPassword ? "text":"password"} placeholder="Enter password" name="confirmPassword" value={user.confirmPassword} onChange={handleFormInputChange("confirmPassword")}/>
                </Form.Group>
                <div className='row'>
                    <div className='col'>
                      <Button variant="primary" onClick={changePassword}>
                        Potvrda
                      </Button>
                    </div>
                    <div className='col' style={{marginLeft:'410px'}}>
                      <Button variant="danger" onClick={togglePassword}>
                        {buttonText}
                      </Button>
                    </div>
                </div>
                {error && <p>Lozinke se ne poklapaju.</p>}
             </Form>
        </div>
    </div>
  )
  }

export default ChangePassword