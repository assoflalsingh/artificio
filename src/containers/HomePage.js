import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from '../components/Navbar'
import SignIn from '../components/SignIn'
import Middle from '../assets/images/Middle.png'



function HomePage () {


  useEffect(() => {
 
  }, [])
  return (
    <div>
        <Navbar/>
         <Row class="bgcolor">
            <Col xs={12} sm={6} md={6} lg={6}><div id="homepgimg"></div></Col>
            <Col xs={12} sm={6} md={6} lg={6}><div id="bottomimg"><SignIn/></div></Col>
        </Row>
    </div>
  )
}



export default HomePage
