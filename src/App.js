import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Theme from './components/Theme';
import SignIn from './routes/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './routes/Dashboard';

export default function App() {
  return (
    <>
    <Theme>
      <CssBaseline />
      <Router>
        <PrivateRoute path='/dashboard' component={Dashboard} />
        <Route path='/login' component={SignIn} />
      </Router>
    </Theme>
    </>
  )
}