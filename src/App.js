import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux'

import Router from './routes'
import store from './store'

function App() {
  return (
     <div className="App">
        <Provider  store={store}>
           <Router />
        </Provider>
        {/* <HomePage/>  */}
      
      {/* <Dashboard/> */}
    </div>
  );
  
}

export default App;
