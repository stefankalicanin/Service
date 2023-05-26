import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
function RegisterUser() {

  const [user, setUser] = useState({
    first_name : '',
    last_name : '',
    username : '',
    password : '',
    birthday : '',
    gender : ''
  });

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setUser({...user, [name] : val})
    
  };

  const register = () => {
    axios.post('http://localhost:8000/api/user/register',
    {
        first_name : user.first_name,
        last_name : user.last_name,
        username : user.username,
        password : user.password,
        birthday : user.birthday,
        gender : user.gender,
        country : user.country,
        city : user.city,
        address : user.address
      })
      .then(res => {
        if (res.status === 201)
            {
                alert('Successfully register!')
                window.location.assign('/login')
            }
      }) 
  };

  return (
    <div>
        <div style = {{
        textAlign : 'center'
    }}>
        </div> 
        <div style={{width : '30%',
                    height:'620px',
                    margin : 'auto',
                    marginTop:'50px',
                    backgroundColor:'#E4E9E1',
                    borderRadius:'25px',
                    border : '1px solid black'
                }}>
                     <h1 style={{paddingLeft:'85px',paddingTop:'10px', backgroundColor:'white',borderRadius:'25px'
                    }}>Create account</h1>
            <Form style={{padding:'30px',
                        paddingTop:'10px'}}>
                
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="first_name" value={user.first_name} onChange={handleFormInputChange("first_name")}/>
                </Form.Group>
                   
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="last_name" value={user.last_name} onChange={handleFormInputChange("last_name")}/>
                </Form.Group>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasiUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter username" name="username" value={user.username} onChange={handleFormInputChange("username")}/>
                </Form.Group>
                </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" name="password" value={user.password} onChange={handleFormInputChange("password")}/>
                </Form.Group>
                </div>
               </div> 
                <Form.Select aria-label="Default select example" name="gender" value={user.gender} onChange={handleFormInputChange("gender")}>
                    <option>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </Form.Select>
                <Form.Group className="mb-3" controlId="formBasicBirthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control type="date" name="birthday" value={user.birthday} onChange={handleFormInputChange("birthday")}/>
                </Form.Group>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" placeholder="Enter country" name="country" value={user.country} onChange={handleFormInputChange("country")}/>
                </Form.Group>
                    </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="Enter city" name="last_name" value={user.city} onChange={handleFormInputChange("city")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" name="address" value={user.address} onChange={handleFormInputChange("address")}/>
                </Form.Group>
                    </div> 
                </div>
                <Button variant="primary" onClick={register}>
                    Submit
                </Button>
             </Form>
        </div>
    </div>
  )
}

export default RegisterUser;