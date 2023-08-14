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
    const [user, setUser] = useState({
      first_name : '',
      last_name : '',
      username : '',
      gender : '',
      birthday : ''
    })
    const [editUser, setEditUser] = useState({
      first_name : '',
      last_name : '',
      username : '',
      gender : '',
      birthday : ''
    })
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
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name="username" value={editUser.username} onChange={handleFormInputChange("username")}/>
                </Form.Group>
      </Form>
      <Form>
                <Form.Group className="mb-3" controlId="formBasicGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control type="text" placeholder="Enter gender" name="gender" value={editUser.gender} onChange={handleFormInputChange("gender")}/>
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
    </div>
  )
}

export default UserProfile