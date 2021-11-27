import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import MedicalRecordForm from './MedicalRecordForm';
import swal from 'sweetalert';

import '../../styles/FindDoctor.css';

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const AddMedicalRecord = () => {
  const history = useHistory();
  const [patientId, setPatientId] = useState('');
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);
  const [viewForm, setViewForm] = useState(false);

  useEffect(() => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    const checkDoctor = async () => {
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

        const isDoctor = await instance.methods.isDoctor(accounts[0]).call();

        if (isDoctor) {
          setBlockchainData({
            ...blockchainData,
            EHRInstance: instance,
            web3: web3,
            account: accounts[0],
          });
        } else {
          swal({
            title: 'Access Denied',
            text: 'Only Doctor have access to this page',
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
      checkDoctor();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, history]);

  const handleSearch = async () => {
    await blockchainData.EHRInstance.methods
      .isPatient(patientId)
      .call()
      .then((value) => {
        if (value) {
          setViewForm(true);
        } else {
          alert('Patient not found!');
        }
      })
      .catch((err) => {
        alert('Error in finding the patient');
      });
  };

  return (
    <Fragment>
      {!viewForm ? (
        <div className='findDoctor-container'>
          <button
            className='findDoctor-backButton'
            onClick={() => history.push('/')}
          >
            Back
          </button>
          <div className='findDoctor-content'>
            <h1 className='findDoctor-title'>Add Patient Record</h1>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '1px',
              }}
            >
              Enter Patient Id
            </p>
            <div className='findDoctor-searchInput'>
              <input
                type='text'
                placeholder='Enter the Account id of the Patient eg. (0x7aF32124e1Df4c17000Df10.....)'
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <div className='findDoctor-buttonDiv'>
              <button onClick={handleSearch} className='findDoctor-button'>
                Search
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MedicalRecordForm
          blockchainData={blockchainData}
          patientId={patientId}
          // history={history}
          setViewForm={setViewForm}
        />
      )}
    </Fragment>
  );
};

export default AddMedicalRecord;
