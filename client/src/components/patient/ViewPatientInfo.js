import React from 'react';
import { useHistory } from 'react-router-dom';

import '../../styles/ViewDoctorInfo.css';

const ViewPatientInfo = (props) => {
  const { data } = props;
  const history = useHistory();
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
        <h1 className='viewDoctorInfo-title'>Patient's Information</h1>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='firstName'
            placeholder='First name'
            value={data.firstName}
            disabled
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last name'
            value={data.lastName}
            disabled
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='dob'
            placeholder='Date of Birth'
            value={data.dob}
            disabled
          />
          <input
            type='text'
            name='gender'
            placeholder='Gender'
            value={data.gender}
            disabled
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={data.email}
            disabled
          />
          <input
            type='tel'
            name='mobileNo'
            placeholder='Mobile Number'
            value={data.mobileNo}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPatientInfo;
