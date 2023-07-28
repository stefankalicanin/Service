import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Image } from 'react-bootstrap';
import user_information from '../Home/img/user_information.png'

function ShowProfile() {

  const [users, setUsers] = useState([])
  useEffect(()=> {
    axios.get('http://localhost:8000/api/admin/users/profiles')
    .then(response=> {
      console.log(response.data)
      setUsers(response.data)
    })
    .catch(error=> {
      console.log(error)
    })
  })
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {users.map(u=> (
         <Card key={u.id} style={{ width: '300px', margin: '10px' }}>
      <Card.Body>
        <Image src={user_information} roundedCircle style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
        <Card.Title>Profil korisnika</Card.Title>
        <Card.Text>
          <strong>Ime:</strong> {u.first_name}
        </Card.Text>
        <Card.Text>
          <strong>Prezime:</strong> {u.last_name}
        </Card.Text>
        <Card.Text>
          <strong>Korisničko ime:</strong> {u.username}
        </Card.Text>
        <Card.Text>
          <strong>Pol:</strong> {u.gender}
        </Card.Text>
        <Card.Text>
          <strong>Datum rodjenja:</strong> {u.birthday}
        </Card.Text>
      </Card.Body>
    </Card>
    ))}
    </div>
  )
}

export default ShowProfile