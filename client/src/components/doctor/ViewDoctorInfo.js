import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import '../../styles/ViewDoctorInfo.css';

const initialData = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  mobileNo: '',
  city: '',
  state: '',
  speciality: '',
};

const ViewDoctorInfo = () => {
  const history = useHistory();
  const [doctorDetails, setDoctorDetails] = useState(initialData);
  return (
    <div className='viewDoctorInfo-container'>
      <div className='viewDoctorInfo-backButtonDiv'>
        <button
          className='viewDoctorInfo-backButton'
          onClick={() => history.push('/')}
        >
          Back
        </button>
      </div>
      <div className='viewDoctorInfo-form-container'>
        <h1 className='viewDoctorInfo-title'>Doctor's Information</h1>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='firstName'
            placeholder='First name'
            value={doctorDetails.firstName}
            disabled
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last name'
            value={doctorDetails.lastName}
            disabled
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='dob'
            placeholder='Date of Birth'
            value={doctorDetails.dob}
            disabled
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={doctorDetails.email}
            disabled
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='tel'
            name='mobileNo'
            placeholder='Mobile Number'
            value={doctorDetails.mobileNo}
            disabled
          />
          <input
            type='text'
            name='speciality'
            placeholder='Speciality'
            value={doctorDetails.speciality}
            disabled
          />
        </div>

        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='city'
            placeholder='City'
            value={doctorDetails.city}
            disabled
          />
          <input
            type='text'
            name='state'
            placeholder='State'
            value={doctorDetails.state}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ViewDoctorInfo;
