import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
function RegisterRepair() {

  const [user, setUser] = useState({
    first_name : '',
    last_name : '',
    username : '',
    password : '',
    birthday : '',
    gender : '',
    type : '',
    country : '',
    city : '',
    address : '',
    zip : '',
    region : '',
    number : ''
  });

  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setUser({...user, [name] : val})
    
  };

  const register = () => {
    axios.post('http://localhost:8000/api/repairer/register',
    {
        first_name : user.first_name,
        last_name : user.last_name,
        username : user.username,
        password : user.password,
        birthday : user.birthday,
        gender : user.gender,
        country : user.country,
        city : user.city,
        address : user.address,
        type : user.type
      })
      .then(res => {
       if (res.status === 201)
        {
            alert('Successfully added repairer!')
            window.location.assign('/admin/home')
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
                    margin : 'auto'
                }}>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="first_name" value={user.first_name} onChange={handleFormInputChange("first_name")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="last_name" value={user.last_name} onChange={handleFormInputChange("last_name")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter username" name="username" value={user.username} onChange={handleFormInputChange("username")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" name="password" value={user.password} onChange={handleFormInputChange("password")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicGender">
                <Form.Select aria-label="Default select example" name="gender" value={user.gender} onChange={handleFormInputChange("gender")}>
                    <option>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </Form.Select>
                </Form.Group> 
                <Form.Group className="mb-3" controlId="formBasicBirthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control type="date" name="birthday" value={user.birthday} onChange={handleFormInputChange("birthday")}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicType">
                <Form.Select aria-label="Default select example" name="type" value={user.type} onChange={handleFormInputChange("type")}>
                    <option>Select type</option>
                    <option value={"REPAIR_DIAGNOSTIC"}>For diagnostics</option>
                    <option value={"REPAIR_TROUBLESHOOTING"}>For repair</option>
                </Form.Select>
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
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control type="text" placeholder="Enter zip code" name="zip" value={user.zip} onChange={handleFormInputChange("zip")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicRegion">
                    <Form.Label>Region</Form.Label>
                    <Form.Control type="text" placeholder="Enter region" name="region" value={user.region} onChange={handleFormInputChange("region")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicNumber">
                    <Form.Label>Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter number" name="number" value={user.number} onChange={handleFormInputChange("number")}/>
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

export default RegisterRepair;