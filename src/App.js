import React from 'react';
import { CssBaseline, StylesProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import configureStore from './store/index';
import './App.css';

import Theme from './components/Theme';
import SignIn from './routes/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './routes/Dashboard';
import SignUp from './routes/SignUp';
import Activate from './routes/Activate';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';

import { LicenseManager } from 'ag-grid-enterprise';
import APP_CONFIGS from './app-config';
LicenseManager.setLicenseKey(APP_CONFIGS.AG_GRID_LICENCE_KEY);

const reduxStore = configureStore({
  user: {
    user_set: false,
  }
});

export default function App() {
  return (
    <>
    <Theme>
      <StylesProvider injectFirst>
        <CssBaseline />
        <ReduxProvider store={reduxStore}>
          <Router basename="/app">
          <Switch>
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/activate' component={Activate} />
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/resetpassword' component={ResetPassword} />
            <Redirect to="/dashboard" />
          </Switch>
          </Router>
        </ReduxProvider>
      </StylesProvider>
    </Theme>
    </>
  )
}