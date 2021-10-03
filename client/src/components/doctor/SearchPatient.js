import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
// import AddMedicalRecord from '../doctor/AddMedicalRecord';

import '../../styles/FindDoctor.css';

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const SearchPatient = () => {
  const history = useHistory();
  const [patientId, setPatientId] = useState('');
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);
  const [viewForm, setViewForm] = useState(false);
  const [, setPatientDetails] = useState({});

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
  }, [blockchainData, boolVal]);

  const handleSearch = async () => {
    await blockchainData.EHRInstance.methods
      .getPatientInfoByAddress(patientId)
      .call()
      .then((value) => {
        ipfs.cat(value).then((data) => {
          const val = JSON.parse(data);
          setPatientDetails(val);
        })
        setViewInfo(true);
      })
      .catch(err => {
        alert('Error in finding doctor information');
      });
  };

  return (
    <Fragment>
      {
        !viewInfo ? (<div className='findDoctor-container'>
          <button
            className='findDoctor-backButton'
            onClick={() => history.push('/')}
          >
            Back
          </button>
          <div className='findDoctor-content'>
            <h1 className='findDoctor-title'>Search Patient Information</h1>
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
        </div>) : (<ViewPatientInfo data={patientDetails} />)
      }
    </Fragment>
  );
};

export default SearchPatient;