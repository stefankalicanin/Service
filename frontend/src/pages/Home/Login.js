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

    const handleFormInputChange = (name) => (event) => {
        const val = event.target.value;
        setCredentials({...credentials, [name] : val})
    };

    const login = async () => {
        await AuthenticationService.login(credentials)
        .then((value)=>{if (value === 401) {setError(true)}})
       ;}


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
                    }}>Login</h1>
            <Form style={{padding:'30px',
                        paddingTop:'50px'}}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" placeholder="Enter email" name="username" value={credentials.username} onChange={handleFormInputChange("username")}/>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleFormInputChange("password")}/>
                </Form.Group>
                <Button variant="primary" onClick={login}>
                    Submit
                </Button>
             </Form>
             <div style={{width : '50%',
                    margin : 'auto',
                paddingTop : '10px'}}>
                {error && <p>Wrong username/password!</p>}
             </div>
        </div>
    </div>
  )
}

export default Login;