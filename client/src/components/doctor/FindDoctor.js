import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';

import '../../styles/FindDoctor.css';

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const FindDoctor = () => {
  const history = useHistory();
  const [doctorId, setDoctorId] = useState('');
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
  }, [blockchainData, boolVal]);

  const handleSearch = async () => {
    await blockchainData.EHRInstance.methods
      .getDoctorInfoByAddress(doctorId)
      .call()
      .then((value) => {
        ipfs.cat(value).then((data) => {
          const val = JSON.parse(data);
          console.log(val);
        });
      });
  };

  return (
    <div className='findDoctor-container'>
      <button
        className='findDoctor-backButton'
        onClick={() => history.push('/')}
      >
        Back
      </button>
      <div className='findDoctor-content'>
        <h1 className='findDoctor-title'>Search Doctor Information</h1>
        <div className='findDoctor-searchInput'>
          <input
            type='text'
            placeholder='Enter the Account id of the Doctor eg. (0x7aF32124e1Df4c17000Df10.....)'
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
        </div>
        <div className='findDoctor-buttonDiv'>
          <button onClick={handleSearch} className='findDoctor-button'>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;
