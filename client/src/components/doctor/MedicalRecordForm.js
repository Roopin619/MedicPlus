import React, { useState } from 'react';
import '../../styles/MedicalRecordForm.css';

const MedicalRecordForm = () => {
  return (
    <div className='medicalRecord-container'>
      <form>
        <div className='medicalRecord-form-container'>
          <div className='medicalRecord-title'>
            <h1>Patient Medical Record</h1>
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='text'
              name='firstName'
              placeholder='First name'
              // value={patientDetails.firstName}
              // onChange={handleChange}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last name'
              // value={patientDetails.lastName}
              // onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='text'
              name='dob'
              placeholder='Date of Birth'
              // value={patientDetails.dob}
              // onChange={handleChange}
            />
            <input
              type='text'
              name='gender'
              placeholder='Gender'
              // value={patientDetails.gender}
              // onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              // value={patientDetails.email}
              // onChange={handleChange}
            />
            <input
              type='tel'
              name='mobileNo'
              placeholder='Mobile Number'
              // value={patientDetails.mobileNo}
              // onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-daignosis-section'>
            <div className='medicalRecord-content'>
              <h3 className='daignosis-title'>Medical Record</h3>
              <p className='daignosis-para'>Daignosis</p>
              <p className='daignosis-para'>Rx</p>
              <textarea
                className='daignosis-textarea'
                rows='5'
                cols='60'
                placeholder="Doctor's Daigonis..."
              />
            </div>
          </div>
          <div className='medications-section'>
            <h3 className='daignosis-title'>Medications</h3>
            <div className='medications-header'>
              <p className='medications-column1'>#</p>
              <p className='medications-column2'>BRAND NAME</p>
              <p className='medications-column2'>DOSAGE</p>
              <p className='medications-column2'>FREQUENCY</p>
              <p className='medications-column2'>NO. OF DAYS</p>
              <p className='medications-column2'>REMARKS</p>
              <p className='medications-column2'>ACTION</p>
            </div>
          </div>
          <div className='medicalRecord-buttonDiv'>
            <button type='submit' className='medicalRecord-button'>
              Add Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;
