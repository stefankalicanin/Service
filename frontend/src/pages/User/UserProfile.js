import {React, useEffect, useState} from 'react'
import {TokenService} from '../../services/TokenService'
import UserDiagnosticRequest from './UserDiagnosticRequest';
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import { Card, Image } from 'react-bootstrap';
import user_information from '../Home/img/user_information.png'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form';

function UserProfile() {

    const decoded_token = TokenService.decodeToken(TokenService.getToken())
    const [showModal, setShowModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const buttonText = showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku';
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [user, setUser] = useState({
      first_name : '',
      last_name : '',
      username : '',
      gender : 'Muški',
      birthday : ''
    })
    const [editUser, setEditUser] = useState({
      first_name : '',
      last_name : '',
      gender : '',
      birthday : ''
    })
    const [changePasswordData, setChangePasswordData] = useState({
      username: decoded_token.username,
      current_password : '',
      new_password:''
    })
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(false)

    useEffect(() => {
      axios.get(`http://localhost:8000/api/user/profile/${decoded_token.user_id}`)
      .then(response  => {
        setUser(response.data)
      })
      .catch(error => {
        console.log(error)
      })
    }, [])
  
    const handleFormInputChange = (name) => (event) => {
      const val = event.target.value;
      setEditUser({...editUser, [name]:val});
    }
  
    const changeProfileData = () => {
      console.log("Edit data:", editUser)
      axios.post('http://localhost:8000/api/user/profile/edit', editUser)
      .then(response => {
        console.log(response.data)
        window.alert("Uspešno izmenjeni podaci")
        window.location.reload();
      })
      .catch(error=> {
        console.log(error)
      })
      
      setShowModal(false);
    }
  
    const handleEditProfile = () => {
      setShowModal(true);
      setEditUser({...user});
    }

    const handlePasswordData = (name) => (event) => {
      const val = event.target.value;
      setChangePasswordData({...changePasswordData, [name] : val})
    }

    const changePassword = () => {
      setShowPasswordModal(true);
    }

    const handleChangePassword = () => {
      if(changePasswordData.current_password === '' || changePasswordData.new_password === '') {return;}
      axios.post('http://localhost:8000/api/user/password/change', changePasswordData)
      .then(response=> {
        console.log(response.data)
        window.alert('Uspesno')
        setShowPasswordModal(false)
      }
      )
      .catch(error=>{
        if(error.response.status === 400) {
          setErrorCurrentPassword(true)
        }
        else 
        {
          setErrorCurrentPassword(false)
        }
      })
    }

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

  return (
    <div>
         <Card>
      <Card.Body>
        <Image src={user_information} roundedCircle style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
        <Card.Title>Profil korisnika</Card.Title>
        <Card.Text>
          <strong>Ime:</strong> {user.first_name}
        </Card.Text>
        <Card.Text>
          <strong>Prezime:</strong> {user.last_name}
        </Card.Text>
        <Card.Text>
          <strong>Korisničko ime:</strong> {user.username}
        </Card.Text>
        <Card.Text>
          <strong>Pol:</strong> {user.gender}
        </Card.Text>
        <Card.Text>
          <strong>Datum rodjenja:</strong> {user.birthday}
        </Card.Text>
        <Button onClick={handleEditProfile}>Izmeni profil</Button>
        <Button className='btn-danger' style={{marginLeft:'80px'}} onClick={changePassword}>Izmeni lozinku</Button>
      </Card.Body>
    </Card>
    <Modal show={showModal} onHide={()=>setShowModal(false)}>
      <Modal.Header closeButton onClick={()=> setShowModal(!showModal)}>
        <Modal.Title>Izmeni profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="first_name" value={editUser.first_name} onChange={handleFormInputChange("first_name")}/>
                </Form.Group>
      </Form>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="last_name" value={editUser.last_name} onChange={handleFormInputChange("last_name")}/>
                </Form.Group>
      </Form>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicGender">
                    <Form.Label>Pol</Form.Label>
                <Form.Select aria-label="Default select example" name="gender" value={editUser.gender} onChange={handleFormInputChange("gender")}>
                    <option value="Muški">Muški</option>
                    <option value="Ženski">Ženski</option>
                </Form.Select>
                </Form.Group> 
      </Form>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicBirthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control type="text" placeholder="Enter birthday" name="birthday" value={editUser.birthday} onChange={handleFormInputChange("birthday")}/>
                </Form.Group>
      </Form>
      <Button onClick={changeProfileData}>Potvrdi</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={()=>setShowModal(false)}>Izadji</Button>
      </Modal.Footer>
    </Modal>
    <Modal show={showPasswordModal} onHide={()=>setShowPasswordModal(false)}>
      <Modal.Header closeButton onClick={() => setShowPasswordModal(!showPasswordModal)}>
        <Modal.Title>Promena lozinke</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicCurrentPassword">
                    <Form.Label>Trenutna lozinka</Form.Label>
                    <Form.Control type={showPassword ? 'text':'password'} placeholder="Unesite trenutnu lozinku" name="current_password" value={changePassword.currentPassword} onChange={handlePasswordData("current_password")} />
                    {changePasswordData.current_password === "" && (
        <Form.Text className="text-danger">
            Molimo unesite trenutnu lozinku!
        </Form.Text>)}
                </Form.Group>
      </Form>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                    <Form.Label>Nova lozinka</Form.Label>
                    <Form.Control type={showPassword ? 'text':'password'} placeholder="Unesite novu lozinku" name="new_password" value={changePassword.newPassword} onChange={handlePasswordData("new_password")} />
                    {changePasswordData.new_password === "" && (
        <Form.Text className="text-danger">
            Molimo unesite novu lozinku!
        </Form.Text>)}
                </Form.Group>
      
      </Form>
      {errorCurrentPassword && <p>Pogrešno uneta trenutna lozinka!</p>}
      
      <Button onClick={handleChangePassword}>Potvrdi</Button>
      <Button variant='danger' onClick={togglePassword} style={{marginLeft:'260px'}}>{buttonText}</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={()=>setShowPasswordModal(false)}>Izadji</Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default UserProfile