import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import swal from 'sweetalert';

import '../../styles/AddDoctor.css';

const initialData = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  mobileNo: '',
  patientId: '',
  gender: '',
};

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const AddPatient = () => {
  const history = useHistory();
  const [patientDetails, setPatientDetails] = useState(initialData);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);

  useEffect(() => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    const loadBlockchain = async () => {
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

        setBlockchainData({
          ...blockchainData,
          EHRInstance: instance,
          web3: web3,
          account: accounts[0],
        });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    if (!boolVal) {
      loadBlockchain();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, history]);

  const handleChange = (e) => {
    const { name } = e.target;
    setPatientDetails({ ...patientDetails, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoStr = JSON.stringify(patientDetails);
    await ipfs.add(infoStr).then(async (hash) => {
      try {
        await blockchainData.EHRInstance.methods
          .addPatientInfo(patientDetails.patientId, hash)
          .send({ from: blockchainData.account });
        swal({
          title: 'Success',
          text: 'Patient Registerd Successfully',
          icon: 'success',
          button: 'ok',
        }).then(() => window.location.reload());
      } catch (err) {
        swal({
          title: 'Error',
          text: '1.Only Admin can Add Users\n2.This id already has a role',
          icon: 'error',
          button: 'ok',
        }).then(() => window.location.reload());
      }
    });
  };

  return (
    <div className='addDoctor-container'>
      <div className='addDoctor-backButtonDiv'>
        <button
          className='addDoctor-backButton'
          onClick={() => history.push('/admin')}
        >
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='addDoctor-form-container'>
          <h1 className='addDoctor-title'>Add Patient </h1>
          <div className='addDoctor-form-row-wise'>
            <input
              type='text'
              className='addDoctor'
              name='firstName'
              placeholder='First name'
              value={patientDetails.firstName}
              onChange={handleChange}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last name'
              value={patientDetails.lastName}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise'>
            <input
              type='text'
              name='dob'
              placeholder='Date of Birth'
              value={patientDetails.dob}
              onChange={handleChange}
            />
            <input
              type='text'
              name='gender'
              placeholder='Gender'
              value={patientDetails.gender}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={patientDetails.email}
              onChange={handleChange}
            />
            <input
              type='tel'
              name='mobileNo'
              placeholder='Mobile Number'
              value={patientDetails.mobileNo}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise '>
            <input
              type='text'
              name='patientId'
              placeholder='Patient ID'
              className='lastInput'
              value={patientDetails.patientId}
              onChange={handleChange}
            />
          </div>

          <div className='addDoctor-buttonDiv'>
            <button type='submit' className='addDoctor-button'>
              Add Patient
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
