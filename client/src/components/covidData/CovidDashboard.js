import React from 'react';
import VaccinationGraph from './VaccinationGraph';
import '../../styles/CovidDashboard.css';

const CovidDashboard = () => {
  return (
    <div className='mainContainer'>
      <div className='covid-content'>
        <h1 className='covid-pageTitle'> Covid Visualisation</h1>
      </div>
      <div className='covid-vaccinationDiv'>
        <VaccinationGraph />
      </div>
    </div>
  );
};

export default CovidDashboard;
