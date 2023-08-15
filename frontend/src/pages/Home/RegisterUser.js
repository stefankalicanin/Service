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
    gender : 'Muški',
    country : '',
    city : '',
    address : '',
    zip : '',
    region : '',
    number : ''
  });
  
  const [submit, setSubmit] = useState(false)
  const handleFormInputChange = (name) => (event) => {
    const val = event.target.value;
    setUser({...user, [name] : val})
  };

  const register = () => {
    setSubmit(true)
    if (user.first_name === "" || user.last_name === "" || user.username === "" || user.password === "" 
    || user.birthday === "" || user.country === "" || user.city === "" || user.address === "" || user.zip === "" ||
    user.region === "" || user.number === "") {
        return;
    }
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
        address : user.address,
        zip: user.zip,
        region : user.region,
        number : user.number
      })
      .then(res => {
        if (res.status === 201)
            {
                alert('Successfully register!')
                window.location.assign('/login')
            }
      })
      .catch(error => {
        console.log(error)
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
                     <h1 style={{paddingLeft:'80px',paddingTop:'40px',backgroundColor:'#ffffff8c',borderRadius:'25px'
                    }}>Kreiranje naloga</h1>
            <Form style={{padding:'30px',
                        paddingTop:'10px'}}>
                <div className='row'>
                    <div className='col'>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" placeholder="Unesite ime..." name="first_name" value={user.first_name} onChange={handleFormInputChange("first_name")} 
                    style={{border : submit && user.first_name === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                </div>
                <div className='col'>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" placeholder="Unesite prezime..." name="last_name" value={user.last_name} onChange={handleFormInputChange("last_name")}
                    style={{border : submit && user.last_name === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                </div>
                </div>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasiUsername">
                    <Form.Label>Korisničko ime</Form.Label>
                    <Form.Control type="email" placeholder="Unesite prezime..." name="username" value={user.username} onChange={handleFormInputChange("username")}
                    style={{border : submit && user.username === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control type="password" placeholder="Unesite lozinku..." name="password" value={user.password} onChange={handleFormInputChange("password")}
                    style={{border : submit && user.password === "" ? '1px solid red':'none'}} />
                </Form.Group>
                </div>
               </div>
               <div className='row'>
                <div className='col'>
                <Form.Group className='mb-3' controlId="formBasicGender">
                <Form.Label>Pol</Form.Label>
                <Form.Select aria-label="Default select example" name="gender" value={user.gender} onChange={handleFormInputChange("gender")}>
                    <option value="Muški">Muški</option>
                    <option value="Ženski">Ženski</option>
                </Form.Select>
                </Form.Group>
                </div>
                <div className='col'>
                <Form.Group className="mb-3" controlId="formBasicBirthday">
                    <Form.Label>Datum rodjenja</Form.Label>
                    <Form.Control type="date" name="birthday" value={user.birthday} onChange={handleFormInputChange("birthday")}
                    style={{border : submit && user.birthday === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                </div>
               </div> 
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicCountry">
                    <Form.Label>Država</Form.Label>
                    <Form.Control type="text" placeholder="Unesite državu..." name="country" value={user.country} onChange={handleFormInputChange("country")}
                    style={{border : submit && user.country === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastCity">
                    <Form.Label>Grad</Form.Label>
                    <Form.Control type="text" placeholder="Unesite grad..." name="last_name" value={user.city} onChange={handleFormInputChange("city")}
                    style={{border : submit && user.city === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastAddress">
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control type="text" placeholder="Unesite adresu..." name="address" value={user.address} onChange={handleFormInputChange("address")}
                    style={{border : submit && user.address === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div> 
                </div>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicNumber">
                    <Form.Label>Broj stana/kuće</Form.Label>
                    <Form.Control type="text" placeholder="Unesite broj stana/kuće..." name="number" value={user.number} onChange={handleFormInputChange("number")}
                    style={{border : submit && user.number === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicRegion">
                    <Form.Label>Region</Form.Label>
                    <Form.Control type="text" placeholder="Unesite region..." name="region" value={user.region} onChange={handleFormInputChange("region")}
                    style={{border : submit && user.region === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                    <Form.Group className="mb-3" controlId="formBasicZip">
                    <Form.Label>Poštanski broj</Form.Label>
                    <Form.Control type="number" placeholder="Unesite poštanski broj..." name="zip" value={user.zip} onChange={handleFormInputChange("zip")}
                    style={{border : submit && user.zip === "" ? '1px solid red':'none'}}/>
                </Form.Group>
                    </div> 
                </div>
                <Button variant="primary" onClick={register}>
                    Registracija
                </Button>
             </Form>
        </div>
    </div>
  )
}

export default RegisterUser;