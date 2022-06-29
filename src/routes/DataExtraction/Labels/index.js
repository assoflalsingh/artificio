import React, { useState } from 'react';
import { Route, Switch as RouteSwitch} from 'react-router-dom';

import LabelForm from './LabelForm';
import LabelList from './LabelList';

export default function Labels({match}) {
  const [formData, setFormData] = useState(null);

  return (
    <RouteSwitch>
      <Route exact path={`${match.url}/`} render={(props)=><LabelList setFormData={setFormData} {...props}/>}></Route>
      <Route path={`${match.url}/create`} render={(props)=><LabelForm initFormData={formData} {...props}/>}></Route>
    </RouteSwitch>
  );
}
