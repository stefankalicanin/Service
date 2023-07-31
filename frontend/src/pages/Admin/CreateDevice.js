import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Form } from 'react-bootstrap'
import {Button} from 'react-bootstrap'
function CreateDevice() {

    const [category, setCategory] = useState([])

    const [device, setDevice] = useState({
        name : '',
        description: '',
        price : '',
        under_warranty : 'true',
        quantity : '',
        id_category : null,
        id_main_device : null
    })

    const [mainDevice, setMainDevice] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:8000/api/user/all_categories')
        .then(response => {
            setCategory(response.data)
            setDevice({...device, ["id_category"]:response.data[0].id})
            console.log("Category:", response.data)
            axios.get(`http://localhost:8000/api/user/all_device_by_category/${response.data[0].id}`)
            .then(response=>{
            setMainDevice(response.data)
            console.log("Main device", response.data)
        })
        .catch(error=>{
            console.log(error)
        })
        })
        .catch(error=> {
            console.log(error)
        })
    }, [])
    
    const createDevice = () => {
        axios.post('http://localhost:8000/api/admin/create/device',
        device)
        .then(response=> {
            console.log(response.data)
        })
        .catch(error=> {
            console.log(error)
        })
    }

    const handleFormInputChange = (name) => (event) => {
        const val = event.target.value;
        setDevice({...device, [name]:val})
    }


    const chooseCategory = (e) => {
        const index = e.target.selectedIndex
        const el = e.target.childNodes[index]
        const id = el.getAttribute('id')
        setDevice({...device, ["id_category"]:id})
        axios.get(`http://localhost:8000/api/user/all_device_by_category/${id}`)
          .then(response => {
            setMainDevice(response.data)
            console.log("Device", response.data)
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
                height:'550px',
                margin : 'auto',
                marginTop:'50px',
                backgroundColor:'#E4E9E1',
                borderRadius:'25px',
                border : '1px solid black'
            }}>
                 <h1 style={{paddingLeft:'130px',paddingTop:'40px',backgroundColor:'#ffffff8c',borderRadius:'25px'
                }}>Kreiranje uredjaja</h1>
        <Form style={{padding:'30px',
                        paddingTop:'10px'}}>
            <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" placeholder="Unesite naziv..." name="name" value={device.name} onChange={handleFormInputChange("name")}/>
                </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" placeholder="Unesite opis..." name="description" value={device.description} onChange={handleFormInputChange("description")}/>
            </Form.Group>
            <div className='row'>
                <div className='col'>
            <Form.Group className="mb-3" controlId="formBasicPrice">
                    <Form.Label>Cena (€)</Form.Label>
                    <Form.Control type="number" placeholder="Unesite cenu..." name="name" value={device.price} onChange={handleFormInputChange("price")}/>
            </Form.Group>
            </div>
            <div className='col'>
            <Form.Group className="mb-3" controlId="formBasicUnder_warranty">
                <Form.Label>Uredjaj pod garancijom</Form.Label>
            <select className="form-select" aria-label="Default select example" required={true} value={device.under_warranty} onChange={handleFormInputChange("under_warranty")}>
              <option value={true}>Da</option>
              <option value={false}>Ne</option>
            </select>
            </Form.Group>
            </div>
            <div className='col'>
            <Form.Group className="mb-3" controlId="formBasicQuantity">
                    <Form.Label>Količina</Form.Label>
                    <Form.Control type="number" placeholder="Unesite količinu" name="name" value={device.quantity} onChange={handleFormInputChange("quantity")}/>
            </Form.Group>
            </div>
            </div>
            <div className='row'>
                <div className='col'>
            <Form.Group className="mb-3" controlId="formBasicCategory">
                <Form.Label>Kategorija</Form.Label>
            <select
            className="form-select"
            aria-label="Default select example"
            required={true}
            onChange={chooseCategory}
            >
            {category.map((c) => (
            <option id={c.id}>
            {c.name}
            </option>
            ))}
</select>
            </Form.Group>
            </div>
            <div className='col'>
            <Form.Group className="mb-3" controlId="formBasicMainDevice">
            <Form.Label>Glavni uredjaj</Form.Label>
            <select className="form-select" aria-label="Default select example" required={true} onChange={handleFormInputChange("id_main_device")} >
              <option value={null}>Nema</option>
              {mainDevice.map(md => 
              <option value={md.id}>{md.name}</option>
              )}
            </select>
            </Form.Group>
            </div>
            </div>
            <Button onClick={createDevice}>Kreiraj</Button>
    </Form>
    </div>
    </div>
  )
}

export default CreateDevice