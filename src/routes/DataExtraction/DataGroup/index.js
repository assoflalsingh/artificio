import React, { useState } from 'react';
import { Route, Switch as RouteSwitch} from 'react-router-dom';

import DataGroupForm from './DataGroupForm';
import DataGroupList from './DataGroupList';

export default function({match}) {
  const [formData, setFormData] = useState(null);

  return (
    <RouteSwitch>
      <Route exact path={`${match.url}/`} render={(props)=><DataGroupList setFormData={setFormData} {...props}/>}></Route>
      <Route path={`${match.url}/createdg`} render={(props)=><DataGroupForm initFormData={formData} {...props}/>}></Route>
    </RouteSwitch>
  );
}
