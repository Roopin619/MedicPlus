import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import Admin from './components/admin/Admin';
import AddDoctor from './components/admin/AddDoctor';
import FindDoctor from './components/doctor/FindDoctor';
import AddPatient from './components/admin/AddPatient';
import FindPatient from './components/patient/FindPatient';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ViewDoctorInfo from './components/doctor/ViewDoctorInfo';
import AddMedicalRecord from './components/doctor/AddMedicalRecord';
import ViewMedicalRecord from './components/patient/ViewMedicalRecord';
import EditPatientInfo from './components/patient/EditPatientInfo';
import EditDoctorInfo from './components/doctor/EditDoctorInfo';
import CovidPage from './components/covidData/CovidPage';
import OrganLanding from './components/organDonation/OrganLanding';
import DonorSignUp from './components/organDonation/donor-signup';
import DonorLogin from './components/organDonation/donor-login';
import DonorProfile from './components/organDonation/donor-profile';
import HospitalLogin from './components/organDonation/hospital-login';

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/admin' component={Admin} />
      <Route exact path='/addDoctor' component={AddDoctor} />
      <Route exact path='/findDoctor' component={FindDoctor} />
      <Route exact path='/doctorInfo' component={ViewDoctorInfo} />
      <Route exact path='/addPatient' component={AddPatient} />
      <Route exact path='/findPatient' component={FindPatient} />
      <Route exact path='/addMedicalRecord' component={AddMedicalRecord} />
      <Route exact path='/viewMedicalRecord' component={ViewMedicalRecord} />
      <Route exact path='/editPatientInfo' component={EditPatientInfo} />
      <Route exact path='/editDoctorInfo' component={EditDoctorInfo} />
      <Route exact path='/covid-info' component={CovidPage} />
      <Route exact path='/organ-donation' component={OrganLanding} />
      <Route exact path='/organ-donation/donor-signup' component={DonorSignUp} />
      <Route exact path='/organ-donation/donor-login' component={DonorLogin} />
      <Route exact path='/organ-donation/donor-profile' component={DonorProfile} />
      <Route exact path='/organ-donation/hospital-login' component={HospitalLogin} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
