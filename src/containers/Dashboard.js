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
    <div>
        <Navbar/>
         <Row>
            <Col xs={2}><AccordionList/></Col>
            <Col xs={10}><Container><QuickLoad/></Container></Col>
        </Row>
    </div>
  )
}



export default Dashboard

const Container = styled.div`
background-color: white;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center`