import React from 'react'
import images from '../../assets/images/images'
import "./NavBar.css"
import UserIcon from '../userIcon/UserIcon'

const NavBar = () => {
  return (
    <div className='div-nav'>

      <div>
        <UserIcon />
      </div>
      <div className='nav-ul-title'>
        <div>
          <h1 className='text-4xl font-medium' style={{ color: "white",cursor:"pointer" }} onClick={()=>{
            window.location.pathname = "/"
            
          }}>ROCOLIS</h1>
        </div>
        <div>
          <nav>
            <ul className='links-ul'>
              <li><a className='mylinks' href='/'>Accueil</a></li>
              <li><a className='mylinks'>Destinations</a></li>
              <li><a href='/contacter-nous' className='mylinks'>Nous contacter</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar 