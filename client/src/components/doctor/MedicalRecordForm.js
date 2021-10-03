import React, { useState } from 'react';
import ipfs from '../../ipfs';
import swal from 'sweetalert';
import '../../styles/MedicalRecordForm.css';

const initialData = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  mobileNo: '',
  diagnosis: '',
  gender: '',
};

const MedicalRecordForm = (props) => {
  const { blockchainData, patientId } = props;
  // const [medicineInputCount, setMedicineInputCount] = useState(1);
  // const [medications, setMedications] = useState([]);
  const [medicalRecord, setMedicalRecord] = useState(initialData);

  const handleChange = (e) => {
    const { name } = e.target;
    setMedicalRecord({ ...medicalRecord, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoStr = JSON.stringify(medicalRecord);
    await ipfs.add(infoStr).then(async (hash) => {
      try {
        await blockchainData.EHRInstance.methods
          .addMedicalRecord(hash, patientId)
          .send({ from: blockchainData.account });
        swal({
          title: 'Success',
          text: 'Medical record added successfully',
          icon: 'success',
          button: 'ok',
        }).then(() => window.location.reload());
      } catch (err) {
        swal({
          title: 'Error',
          text: 'Only Doctors can add Medical Records',
          icon: 'error',
          button: 'ok',
        }).then(() => window.location.reload());
      }
    });
  };

  return (
    <div className='medicalRecord-container'>
      <form onSubmit={handleSubmit}>
        <div className='medicalRecord-form-container'>
          <div className='medicalRecord-title'>
            <h1>Patient Medical Record</h1>
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='text'
              name='firstName'
              placeholder='First name'
              value={medicalRecord.firstName}
              onChange={handleChange}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last name'
              value={medicalRecord.lastName}
              onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='text'
              name='dob'
              placeholder='Date of Birth'
              value={medicalRecord.dob}
              onChange={handleChange}
            />
            <input
              type='text'
              name='gender'
              placeholder='Gender'
              value={medicalRecord.gender}
              onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-row-wise'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={medicalRecord.email}
              onChange={handleChange}
            />
            <input
              type='tel'
              name='mobileNo'
              placeholder='Mobile Number'
              value={medicalRecord.mobileNo}
              onChange={handleChange}
            />
          </div>
          <div className='medicalRecord-daignosis-section'>
            <div className='medicalRecord-content'>
              <h3 className='daignosis-title'>Medical Record</h3>
              <p className='daignosis-para'>Diagnosis</p>
              <p className='daignosis-para'>Rx</p>
              <textarea
                className='daignosis-textarea'
                rows='5'
                cols='60'
                name='diagnosis'
                placeholder="Doctor's Diagnosis..."
                value={medicalRecord.diagnosis}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className='medications-section'>
            <h3 className='daignosis-title'>Medications</h3>
            <div className='medications-header'>
              <p className='medications-column1'>#</p>
              <p className='medications-column2'>MEDICINE NAME</p>
              <p className='medications-column2'>DOSAGE</p>
              <p className='medications-column2'>FREQUENCY</p>
              <p className='medications-column2'>NO. OF DAYS</p>
              <p className='medications-column2'>REMARKS</p>
              <p className='medications-column2'>ACTION</p>
            </div>
          </div> */}
          {/* <div className='medications-input-row'>
            <div>{medicineInputCount}</div>
            <div><input type="text" /></div>
          </div> */}
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
