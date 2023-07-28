import axios from 'axios';
import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Form } from 'react-bootstrap';
function CreateCategory() {

    const [category, setCategory] = useState({
        name : '',
        size : ''
    })

    const [error, setError] = useState({
        name : false
    })

    const handleFormInputChange = (name) => (event) => {
        const val = event.target.value;
        setCategory({...category, [name]:val})
    }

    const createCategory = () => {
        if(category.name.trim() === '') {
            setError({...error, ["name"]:true})
            return;
        }
        axios.post('http://localhost:8000/api/admin/create/category', category)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

  return (
    <div>
    <div style = {{
    textAlign : 'center'
}}>
    </div> 
    <div style={{width : '40%',
                height:'380px',
                margin : 'auto',
                marginTop:'50px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black'
            }}>
                 <h1 style={{paddingLeft:'130px',paddingTop:'40px',backgroundColor:'#ffffff8c',borderRadius:'25px'
                }}>Kreiranje kategorije</h1>
        <Form style={{padding:'30px',
                        paddingTop:'10px'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" placeholder="Unesite naziv..." name="name" value={category.name} onChange={handleFormInputChange("name")}/>
                </Form.Group>
                {error.name && <p style={{color:'red'}}>Molimo unesite naziv kategorije!</p>}
                <Form.Group>
                    <Form.Label>Unesite veličinu </Form.Label>
                <Form.Select aria-label="Default select example" name="type" value={category.size} onChange={handleFormInputChange("size")}>
                    <option value={"BIG"}>Kategorija - velika</option>
                    <option value={"SMALL"}>Kategorija - mala</option>
                </Form.Select>
                </Form.Group>
                <div style={{marginTop:'10px'}}>
                <Button variant='primary' onClick={createCategory}>Kreiraj</Button>
                </div>
        </Form>
    </div>
    </div>
  )
}

export default CreateCategory