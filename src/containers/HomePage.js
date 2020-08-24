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
         <Row>
            <Col xs={6}><div>Image goes here</div></Col>
            <Col xs={6}><SignIn/></Col>
        </Row>
    </div>
  )
}



export default HomePage
