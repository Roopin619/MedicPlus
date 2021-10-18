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
  const { blockchainData, patientId, setViewForm } = props;
  // const [medications, setMedications] = useState([]);
  const [medicalRecord, setMedicalRecord] = useState(initialData);

  // inputList is for Medication record array
  const [inputList, setInputList] = useState([
    { medicineName: '', dosage: '', frequency: '', days: '', remarks: '' },
  ]);

  //clinical test records
  const [clinicalTestList, setClinicalTestList] = useState([
    { clinicalTest: '' },
  ]);

  const handleChange = (e) => {
    const { name } = e.target;
    setMedicalRecord({ ...medicalRecord, [name]: e.target.value });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      { medicineName: '', dosage: '', frequency: '', days: '', remarks: '' },
    ]);
  };

  const handleTestChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...clinicalTestList];
    list[index][name] = value;
    setClinicalTestList(list);
  };

  // handle click event of the Remove button
  const handleRemoveTest = (index) => {
    const list = [...clinicalTestList];
    list.splice(index, 1);
    setClinicalTestList(list);
  };

  // handle click event of the Add button
  const handleAddTest = () => {
    setClinicalTestList([...clinicalTestList, { clinicalTest: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newMedicationList = inputList.filter(
      (i) =>
        i.medicineName !== '' ||
        i.dosage !== '' ||
        i.frequency ||
        i.days !== '' ||
        i.remarks !== ''
    );
    let newClinicalList = clinicalTestList.filter((c) => c.clinicalTest !== '');
    const prescription = {
      ...medicalRecord,
      medications: newMedicationList,
      clinicalTests: newClinicalList,
    };

    // console.log(prescription);

    const infoStr = JSON.stringify(prescription);
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
        <div className='medications-section'>
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
        </div>
        {inputList.map((x, i) => (
          <div className='medications-input-row' key={i}>
            <span className='medications-column1'>{i + 1}</span>
            <input
              type='text'
              className='medications-input-fields'
              name='medicineName'
              value={x.medicineName}
              onChange={(e) => handleInputChange(e, i)}
            />
            <input
              type='text'
              className='medications-input-fields'
              name='dosage'
              value={x.dosage}
              onChange={(e) => handleInputChange(e, i)}
            />
            <select
              className='medications-input-fields'
              name='frequency'
              value={x.frequency}
              onChange={(e) => handleInputChange(e, i)}
            >
              <option disabled selected={x.frequency === ''} value=''>
                Select
              </option>
              <option value='1'>1 time</option>
              <option value='2'>2 times</option>
              <option value='3'>3 times</option>
            </select>
            <input
              type='text'
              className='medications-input-fields'
              name='days'
              value={x.days}
              onChange={(e) => handleInputChange(e, i)}
            />
            <input
              type='text'
              className='medications-input-fields'
              name='remarks'
              value={x.remarks}
              onChange={(e) => handleInputChange(e, i)}
            />
            {inputList.length > 0 && inputList.length - 1 === i ? (
              <button className='medications-addBtn' onClick={handleAddClick}>
                Add
              </button>
            ) : (
              <button
                className='medications-deleteBtn'
                onClick={() => handleRemoveClick(i)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <div className='clinicalTest-section'>
          <h3 className='daignosis-title'>Recommended Clinical Tests</h3>
          <div className='clinicalTest-header'>
            <p className='clinicalTest-column1'>#</p>
            <p className='clinicalTest-column2'>Clinical Test</p>
            <p className='clinicalTest-column2'>ACTION</p>
          </div>
        </div>
        {clinicalTestList.map((x, i) => (
          <div className='clinicalTest-input-row' key={i}>
            <span className='clinicalTest-column1'>{i + 1}</span>
            <select
              className='clinicalTest-input-fields'
              name='clinicalTest'
              value={x.clinicalTest}
              onChange={(e) => handleTestChange(e, i)}
            >
              <option disabled selected={x.clinicalTest === ''} value=''>
                Select
              </option>
              <option value='1'>Test 1</option>
              <option value='2'>Test 2</option>
              <option value='3'>Test 3</option>
            </select>
            {clinicalTestList.length > 0 &&
            clinicalTestList.length - 1 === i ? (
              <button className='clinicalTest-addBtn' onClick={handleAddTest}>
                Add
              </button>
            ) : (
              <button
                className='clinicalTest-deleteBtn'
                onClick={() => handleRemoveTest(i)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <div className='medicalRecord-buttonDiv'>
          <button
            type='submit'
            className='medicalRecord-button'
            onClick={handleSubmit}
          >
            Add Record
          </button>
          <button
            type='button'
            onClick={() => setViewForm(false)}
            className='medicalRecord-button-cancel'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
