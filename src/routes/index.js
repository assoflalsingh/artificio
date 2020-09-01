/**
 * Router component.
 * Implements Reach-Router react plugin. https://github.com/reach/router
 */
import React from 'react'
import { Router } from '@reach/router'
import HomePage from '../containers/HomePage'
import Dashboard from '../containers/Dashboard'



export default props => (
  <Router>
      <HomePage path='/login' {...props} />
      <Dashboard path='/dashboard' {...props} />
      {/* <Logout path='/logout' {...props} /> */}
      {/* <PrivateRoute
        path=''
        as={MedicalRecords}
        {...props}
      /> */}
     </Router>
)
