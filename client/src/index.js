import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './components/admin/Admin';
import AddDoctor from './components/admin/AddDoctor';
import FindDoctor from './components/doctor/FindDoctor';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ViewDoctorInfo from './components/doctor/ViewDoctorInfo';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/admin' component={Admin} />
      <Route exact path='/addDoctor' component={AddDoctor} />
      <Route exact path='/findDoctor' component={FindDoctor} />
      <Route exact path='/doctorInfo' component={ViewDoctorInfo} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
