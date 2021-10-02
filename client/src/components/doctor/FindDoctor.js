import React, { useState, useEffect } from 'react';
import EHRContract from "../../contracts/EHR.json";
import getWeb3 from "../../getWeb3";
import ipfs from '../../ipfs';

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const FindDoctor = () => {
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
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        setBlockchainData({ ...blockchainData, EHRInstance: instance, web3: web3, account: accounts[0] })

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }

    if (!boolVal) {
      loadBlockchain();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal])

  const handleSearch = async () => {
    await blockchainData.EHRInstance.methods
      .getDoctorInfoByAddress(doctorId).call()
      .then(value => {
        ipfs.cat(value).then(data => {
          const val = JSON.parse(data)
          console.log(val);
        })
      })
  };

  return (
    <div>
      <h1>Doctor Info</h1>
      <input
        type="text"
        placeholder="Enter the Account id of the Doctor eg. (0x7aF32124e1Df4c17000Df10.....)"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
      />
      <button onClick={handleSearch}>Find</button>
    </div>
  )
}

export default FindDoctor
