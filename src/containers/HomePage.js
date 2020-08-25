import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from '../components/Navbar'
import SignIn from '../components/SignIn'




function HomePage () {


  useEffect(() => {
 
  }, [])
  return (
    <div>
        <Navbar/>
         <Row className="m-0">
            <Col xs={12} sm={6} md={6} lg={6}><div>Image goes here</div></Col>
            <Col xs={12} sm={6} md={6} lg={6}><SignIn/></Col>
        </Row>
    </div>
  )
}



export default HomePage
