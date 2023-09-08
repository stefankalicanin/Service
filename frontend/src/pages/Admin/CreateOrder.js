import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Form } from 'react-bootstrap'
import {Button} from 'react-bootstrap'

function CreateOrder() {

    const [order, setOrder] = useState({
        date : null,
        quantity : null,
        device_id : null
    })
    const [category, setCategory] = useState([])
    const [device, setDevice] = useState([])
    const [error, setError] = useState({
        "device" : true,
        "category" : true
    })
    const [submit, setSubmit] = useState(false)

    const createOrder = () => {
        setSubmit(true)
        if(order.date === null || order.quantity === null || error.device === true || error.category === true) {return;}
        axios.post('http://localhost:8000/api/admin/createOrder',
        order)
        .then(response => {
            console.log(response.data)
            window.location.reload()
        })
        .catch(error => {
            console.log(error)
        })
    }

    const handleFormInputChange = (name) => (event) => {
        const val = event.target.value;
        setOrder({...order, [name]:val})

    }

    useEffect (() => {
        axios.get('http://localhost:8000/api/user/all_categories')
        .then(response => {
            console.log(response.data)
            setCategory(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const chooseCategory = (e) => {
        const selectedCategory = e.target.value;
        if(selectedCategory === 'empty') {
            setError({...error, "category":true})
        }
        else {
            setError({...error, "category":false})
        }
        const index = e.target.selectedIndex
        const el = e.target.childNodes[index]
        const id = el.getAttribute('id')
        axios.get(`http://localhost:8000/api/admin/all_device_by_category/${id}`)
        .then(response => {
          console.log(response.data)
          setDevice(response.data)
        })
        .then(error => {
          console.log(error)
        })
    }

    const chooseDevice = (e) => {
        const selectedDevice = e.target.value;
        if(selectedDevice === 'empty') {
            setError({...error, "device":true})
        }
        else {
            setError({...error, "device":false})
        }
        const index = e.target.selectedIndex
        const el = e.target.childNodes[index]
        const id = el.getAttribute('id')
        setOrder({...order, "device_id":id})
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
                }}>Kreiranje narudzbine</h1>
        <Form style={{padding:'30px',
                        paddingTop:'10px'}}>
                <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label>Datum</Form.Label>
                    <Form.Control type="datetime-local" placeholder="Unesite datum..." name="date" value={order.date} onChange={handleFormInputChange("date")} required/>
                    {order.date === null && (
                        <Form.Text className="text-danger">
                            Molimo unesite datum narudzbine!
                        </Form.Text>
                    )}
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formBasicQuantity">
                    <Form.Label>Količina</Form.Label>
                    <Form.Control type="number" placeholder="Unesite količinu..." min="1" name="quantity" value={order.quantiy} onChange={handleFormInputChange("quantity")} required/>
                    {order.quantity === null && (
                        <Form.Text className="text-danger">
                            Molimo unesite količinu uredjaja!
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Kategorija</Form.Label>
            <select className="form-select" aria-label="Default select example" onChange={chooseCategory} required={true}
            style={{border : submit && error.category ? '1px solid red':'none' }} >
              <option value="empty" selected>Izaberi kategoriju</option>
              {category.map(c => 
              <option id = {c.id}>{c.name}</option>
              )}
            </select>
           </Form.Group> 
           <Form.Group className="mb-3" controlId="formBasicDevice">
            <Form.Label>Uredjaj</Form.Label>
            <select className="form-select" aria-label="Default select example" onChange={chooseDevice} required={true} 
            style={{border : submit && error.device ? '1px solid red':'none' }}>
              <option value="empty" selected>Izaberi uredjaj</option>
              {device.map(d => 
              <option id = {d.id}>{d.name}</option>
              )}
            </select>
           </Form.Group> 
                <div style={{marginTop:'10px'}}>
                <Button variant='primary' onClick={createOrder}>Kreiraj</Button>
                </div>
        </Form>
    </div>
    </div>
  )
}

export default CreateOrder