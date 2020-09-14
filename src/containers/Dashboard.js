import React, { useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from '../components/Navbar'
import AccordionList  from '../components/AccordionList'
import QuickLoad  from '../components/QuickLoad'
import styled from 'styled-components'



function Dashboard () {


  useEffect(() => {
 
  }, [])
  return (
    <div className={"dboard"}>
        {/* <Navbar/> */}
         <Row>
            <Col className={"leftnav"}>
              <div className={"leftnavbg"}>
              <div id="logodboard"></div>
              </div>
              <AccordionList/>
            </Col>
            <Col>
            <div className={"topnav"}>
              <p>Menu</p>
            </div>
            <Container>
              <QuickLoad/></Container>
            </Col>
        </Row>
    </div>
  )
}


export default Dashboard

const Container = styled.div`
background-color: #fff;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center`