import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './components/admin/Admin';
import AddDoctor from './components/admin/AddDoctor';
import FindDoctor from './components/doctor/FindDoctor';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/admin' component={Admin} />
      <Route path='/addDoctor' component={AddDoctor} />
      <Route path='/findDoctor' component={FindDoctor} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

