import React from 'react'
import photoHome from './img/photoHome.jpg'

function Home() {
  return (
    <div>
    
        <img src={photoHome} alt="logo" style = {{
            width : '40%',
            height : '40%',
            marginLeft : '450px'
         }}/>
    </div>
  )
}

export default Home
