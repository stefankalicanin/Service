import React, { useEffect } from 'react'
import axios from 'axios'

function Pricing() {

    useEffect(()=> {
        axios.get('http://localhost:8000/api/admin/pricing/all')
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])
  return (
    <div>Pricing</div>
  )
}

export default Pricing