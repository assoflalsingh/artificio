import React, {useState} from 'react';
import { Route, Switch as RouteSwitch} from 'react-router-dom';

import DataSetForm from './DataSetForm';

export default function(props) {
  return (
    <RouteSwitch>
      <Route exact path={`${props.match.url}/`} render={(props)=><DataSetForm  initFormData={props.location.params} {...props}/>}></Route>
    </RouteSwitch>
  );
}
