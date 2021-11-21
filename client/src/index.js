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

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './history';
import ViewDoctorInfo from './components/doctor/ViewDoctorInfo';
import AddMedicalRecord from './components/doctor/AddMedicalRecord';
import ViewMedicalRecord from './components/patient/ViewMedicalRecord';
import EditPatientInfo from './components/patient/EditPatientInfo';
import EditDoctorInfo from './components/doctor/EditDoctorInfo';
import CovidPage from './components/covidData/CovidPage';
import OrganLanding from './components/organDonation/OrganLanding';
import DonorSignUp from './components/organDonation/DonorSignUp';
import DonorLogin from './components/organDonation/DonorLogin';
import DonorProfile from './components/organDonation/DonorProfile';
import HospitalLogin from './components/organDonation/HospitalLogin';
import HospitalList from './components/organDonation/HospitalList';
import ApproveDonor from './components/organDonation/ApproveDonor';
import PatientRecord from './components/organDonation/PatientRecord';
import RegisterRecipient from './components/organDonation/RegisterRecipient';
import TransplantMatch from './components/organDonation/TransplantMatch';

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
      <Route exact path='/organ-donation/hospital-list/:city' component={HospitalList} />
      <Route exact path='/organ-donation/approve-donor' component={ApproveDonor} />
      <Route exact path="/organ-donation/register-recipient" component={RegisterRecipient} />
      {window.localStorage.getItem("isAuthenticated") ?
        <Route exact path="/organ-donation/approve-donor" component={ApproveDonor} />
        : <Redirect to="/organ-donation/hospital-login" />
      }
      {window.localStorage.getItem("isAuthenticated") ?
        <Route exact path="/organ-donation/patient-record" component={PatientRecord} />
        : <Redirect to="/organ-donation/hospital-login" />
      }
      {window.localStorage.getItem("isAuthenticated") ?
        <Route exact path="/organ-donation/transplant-match" render={() => <TransplantMatch />} />
        : <Redirect to="/organ-donation/hospital-login" />
      }
    </Switch>
  </Router>,
  document.getElementById('root')
);
