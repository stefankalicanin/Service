import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AuthenticationService } from '../../services/AuthenticationService';


function Login() {

    const [credentials, setCredentials] = useState({
        username : '',
        password : ''
    })

    const [error, setError] = useState(false)
    const [errorUsername, setErrorUsername] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const handleFormInputChange = (name) => (event) => {
        const val = event.target.value;
        setCredentials({...credentials, [name] : val})
    };


    const login = async () => {
        if(credentials.username.trim() === '') {
            setErrorUsername(true)
            return;
        }
        if(credentials.password.trim() === '') {
            setErrorPassword(true)
            return;
        }
        setErrorUsername(false)
        setErrorPassword(false)
        await AuthenticationService.login(credentials)
        .then(response=>{if (response.response.status === 500) {setError(true)}})
       ;}


  return (
   <div>
    <div style = {{
        textAlign : 'center'
    }}>
        
    </div> 
        <div style={{width : '30%',
                    height : '450px',
                    margin : 'auto',
                marginTop : '100px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black'}}>
                    <h1 style={{paddingLeft:'75px',paddingTop:'40px',backgroundColor:'#ffffff8c',borderRadius:'25px'
                    }}>Prijava na sistem</h1>
            <Form style={{padding:'30px',
                        paddingTop:'50px'}}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Korisničko ime</Form.Label>
                    <Form.Control type="text" placeholder="Unesite korisničko ime..." name="username" value={credentials.username} onChange={handleFormInputChange("username")} required={true}/>
                </Form.Group>
                {errorUsername && <p style={{color:'red'}}>Molimo unesite korisničko ime!</p>}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control type="password" placeholder="Unesite lozinku..." name="password" onChange={handleFormInputChange("password")} required/>
                </Form.Group>
                {errorPassword && <p style={{color:'red'}}>Molimo unesite lozinku!</p>}
                <Button variant="primary" onClick={login}>
                    Prijava
                </Button>
             </Form>
             <div style={{width : '60%',
                    margin : 'auto',
                color:'red'}}>
                {error && <p>Pogrešno korisničko ime i/ili lozinka!</p>}
             </div>
        </div>
    </div>
  )
}

export default Login;