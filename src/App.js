import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Theme from './components/Theme';
import SignIn from './routes/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './routes/Dashboard';
import SignUp from './routes/SignUp';
import Activate from './routes/Activate';

export default function App() {
  return (
    <>
    <Theme>
      <CssBaseline />
      <Router>
        <PrivateRoute path='/dashboard' component={Dashboard} />
        <Route path='/login' component={SignIn} />
        <Route path='/signup' component={SignUp} />
        <Route path='/activate' component={Activate} />
      </Router>
    </Theme>
    </>
  )
}