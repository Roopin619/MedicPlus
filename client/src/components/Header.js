import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/Header.css';

const Header = () => {
  const history = useHistory();

  const [isActive, setIsActive] = useState('');

  const goToHome = () => {
    history.push('/');
  };

  const handleOpenDoctor = () => {
    if (isActive === 'doctor') setIsActive('');
    else setIsActive('doctor');
  };

  const handleOpenPatient = () => {
    if (isActive === 'patient') setIsActive('');
    else setIsActive('patient');
  };

  return (
    <div className='header-container'>
      <div className='titleName'>
        {' '}
        <h2 className='brandName' onClick={goToHome}>
          MedicPlus
        </h2>
      </div>
      <div className='options-wrapper'>
        <div className='functions-1'>
          <div className='dropdown'>
            <div className='dropdown-btn' onClick={handleOpenDoctor}>
              Doctor
            </div>
            {isActive === 'doctor' && (
              <div className='dropdown-content'>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/addMedicalRecord')}
                >
                  Add Patient Record
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/editDoctorInfo')}
                >
                  Edit Info
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/findDoctor')}
                >
                  View Info
                </div>
              </div>
            )}
          </div>
          <div className='dropdown'>
            <div className='dropdown-btn' onClick={handleOpenPatient}>
              Patient
            </div>
            {isActive === 'patient' && (
              <div className='dropdown-content'>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/viewMedicalRecord')}
                >
                  View Medical Record
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/editPatientInfo')}
                >
                  Edit Info
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => history.push('/findPatient')}
                >
                  View Info
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='functions-2'>
          <div
            className='dropdown-btn'
            onClick={() => history.push('/organ-donation')}
          >
            Organ Donation
          </div>
          <div
            className='dropdown-btn'
            onClick={() => history.push('/covid-info')}
          >
            Covid19
          </div>
          <div className='dropdown-btn' onClick={() => history.push('/admin')}>
            Admin
          </div>
          <div className='dropdown-btn'>About</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
