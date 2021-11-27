import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import swal from 'sweetalert';
import ipfs from '../../ipfs';

import '../../styles/FindDoctor.css';

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
};

const initialData = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  mobileNo: '',
  gender: '',
  diagnosis: '',
  medications: [],
  clinicalTests: [],
};

const ViewMedicalRecord = () => {
  const history = useHistory();
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);
  const [medRecord, setMedRecord] = useState(initialData);

  useEffect(() => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    const checkPatient = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = EHRContract.networks[networkId];
        const instance = new web3.eth.Contract(
          EHRContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        const isPatient = await instance.methods.isPatient(accounts[0]).call();

        if (isPatient) {
          setBlockchainData({
            ...blockchainData,
            EHRInstance: instance,
            web3: web3,
            account: accounts[0],
          });
          await instance.methods
            .viewMedicalRecord(accounts[0])
            .call()
            .then((value) => {
              ipfs.cat(value).then((data) => {
                const val = JSON.parse(data);
                setMedRecord(val);
              });
            })
            .catch((err) => {
              alert("Error in finding patient's medical record");
            });
        } else {
          swal({
            title: 'Access Denied',
            text: 'Only Patient have access to this page',
            icon: 'error',
            button: {
              text: 'go back',
              value: 'back',
            },
          }).then((value) => {
            history.push('/');
          });
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    if (!boolVal) {
      checkPatient();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, history]);

  console.log(medRecord);

  return (
    <div className='medicalRecord-container'>
      <button
        style={{ marginLeft: '1rem' }}
        className='findDoctor-backButton'
        onClick={() => history.push('/')}
      >
        Back
      </button>
      <div className='medicalRecord-form-container'>
        <div className='medicalRecord-title'>
          <h1>Patient Medical Record</h1>
        </div>
        <div className='medicalRecord-row-wise'>
          <input
            type='text'
            name='firstName'
            placeholder='First name'
            value={medRecord.firstName}
            // onChange={handleChange}
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last name'
            value={medRecord.lastName}
            // onChange={handleChange}
          />
        </div>
        <div className='medicalRecord-row-wise'>
          <input
            type='text'
            name='dob'
            placeholder='Date of Birth'
            value={medRecord.dob}
            // onChange={handleChange}
          />
          <input
            type='text'
            name='gender'
            placeholder='Gender'
            value={medRecord.gender}
            // onChange={handleChange}
          />
        </div>
        <div className='medicalRecord-row-wise'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={medRecord.email}
            // onChange={handleChange}
          />
          <input
            type='tel'
            name='mobileNo'
            placeholder='Mobile Number'
            value={medRecord.mobileNo}
            // onChange={handleChange}
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
              value={medRecord.diagnosis}
              // onChange={handleChange}
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
          </div>
        </div>
        {medRecord.medications.map((x, i) => (
          <div className='medications-input-row' key={i}>
            <span className='medications-column1'>{i + 1}</span>
            <input
              type='text'
              className='medications-input-fields'
              name='medicineName'
              value={x.medicineName}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
            <input
              type='text'
              className='medications-input-fields'
              name='dosage'
              value={x.dosage}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
            <input
              type='text'
              className='medications-input-fields'
              name='frequency'
              value={`${x.frequency} ${x.frequency > 1 ? 'times' : 'time'}`}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
            {/**<select
              className='medications-input-fields'
              name='frequency'
              value={x.frequency}
              // onChange={(e) => handleInputChange(e, i)}
            >
              <option disabled selected={x.frequency === ''} value=''>
                Select
              </option>
              <option value='1'>1 time</option>
              <option value='2'>2 times</option>
              <option value='3'>3 times</option>
            </select> */}
            <input
              type='text'
              className='medications-input-fields'
              name='days'
              value={x.days}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
            <input
              type='text'
              className='medications-input-fields'
              name='remarks'
              value={x.remarks}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
          </div>
        ))}
        <div className='clinicalTest-section'>
          <h3 className='daignosis-title'>Recommended Clinical Tests</h3>
          <div className='clinicalTest-header'>
            <p className='clinicalTest-column1'>#</p>
            <p className='clinicalTest-column2'>Clinical Test</p>
          </div>
        </div>
        {medRecord.clinicalTests.map((x, i) => (
          <div className='clinicalTest-input-row' key={i}>
            <span className='clinicalTest-column1'>{i + 1}</span>
            <input
              type='text'
              className='clinicalTest-input-fields'
              name='clinicalTest'
              value={x.clinicalTest}
              disabled
              // onChange={(e) => handleInputChange(e, i)}
            />
            {/**<select
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
            </select> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMedicalRecord;
