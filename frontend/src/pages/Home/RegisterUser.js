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
                    <Form.Control type="text" placeholder="Unesite ime..." name="first_name" value={user.first_name} onChange={handleFormInputChange("first_name")} />
                </Form.Group>
                </div>
                <div className='col'>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" placeholder="Unesite prezime..." name="last_name" value={user.last_name} onChange={handleFormInputChange("last_name")}/>
                </Form.Group>
                </div>
                </div>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasiUsername">
                    <Form.Label>Korisničko ime</Form.Label>
                    <Form.Control type="email" placeholder="Unesite prezime..." name="username" value={user.username} onChange={handleFormInputChange("username")}/>
                </Form.Group>
                </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control type="password" placeholder="Unesite lozinku..." name="password" value={user.password} onChange={handleFormInputChange("password")} />
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
                    <Form.Control type="date" name="birthday" value={user.birthday} onChange={handleFormInputChange("birthday")}/>
                </Form.Group>
                </div>
               </div> 
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicCountry">
                    <Form.Label>Država</Form.Label>
                    <Form.Control type="text" placeholder="Unesite državu..." name="country" value={user.country} onChange={handleFormInputChange("country")}/>
                </Form.Group>
                    </div>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastCity">
                    <Form.Label>Grad</Form.Label>
                    <Form.Control type="text" placeholder="Unesite grad..." name="last_name" value={user.city} onChange={handleFormInputChange("city")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicLastAddress">
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control type="text" placeholder="Unesite adresu..." name="address" value={user.address} onChange={handleFormInputChange("address")}/>
                </Form.Group>
                    </div> 
                </div>
                <div class='row'>
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicNumber">
                    <Form.Label>Broj stana/kuće</Form.Label>
                    <Form.Control type="text" placeholder="Unesite broj stana/kuće..." name="number" value={user.number} onChange={handleFormInputChange("number")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                <Form.Group className="mb-3" controlId="formBasicRegion">
                    <Form.Label>Region</Form.Label>
                    <Form.Control type="text" placeholder="Unesite region..." name="region" value={user.region} onChange={handleFormInputChange("region")}/>
                </Form.Group>
                    </div> 
                    <div class='col'>
                    <Form.Group className="mb-3" controlId="formBasicZip">
                    <Form.Label>Poštanski broj</Form.Label>
                    <Form.Control type="text" placeholder="Unesite poštanski broj..." name="zip" value={user.zip} onChange={handleFormInputChange("zip")}/>
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