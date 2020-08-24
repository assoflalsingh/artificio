import React, { useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from '../components/Navbar'
import AccordionList  from '../components/AccordionList'





function Dashboard () {


  useEffect(() => {
 
  }, [])
  return (
    <div>
        <Navbar/>
         <Row>
            <Col xs={2}><AccordionList/></Col>
            <Col xs={10}>Dashboard Elements to come here</Col>
        </Row>
    </div>
  )
}



export default Dashboard
