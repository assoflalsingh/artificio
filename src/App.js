import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './containers/HomePage';
import Dashboard from './containers/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';

function App() {
  return (
    <div className="App">
        <HomePage/>
      
      {/* <Dashboard/> */}
    </div>
  );
  
}

export default App;
