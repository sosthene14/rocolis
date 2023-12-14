import React from 'react'
import "./Footer.css"
import images from '../../assets/images/images'

export const Footer = () => {
  return (
    <div className='footer'>
      <div className='div-footer-links'>
        <div>
          <ul className='links-ul' id='footer-links'>
            <li><a href='/'  className='mylinks'>Accueil</a></li>
            <li><a  className='mylinks'>Destinations</a></li>
            <li><a href='/contacter-nous'  className='mylinks'>Nous contacter</a></li>
          </ul>
        </div>
        <div className='div-social-networks'>
          <h4>ROCOLIS</h4>
          <img src={images.facebook} />
          <img src={images.instagram} />
          <img src={images.whatsapp} />
        </div>
      </div>
      <p style={{textAlign:"center",marginTop:"40px"}}>Copyrighy Rostel High-Tech</p>
      <div>

      </div>
    </div>
  )
}
