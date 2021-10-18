import React, { useState, useEffect, Fragment } from 'react';
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

const ViewMedicalRecord = () => {
  const history = useHistory();
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);
  const [medRecord, setMedRecord] = useState({});

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
              })
            })
            .catch(err => {
              alert("Error in finding patient's medical record");
            });
        } else {
          swal({
            title: 'Access Deneid',
            text: 'Only Patient have acess to this page',
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

  return (
    <Fragment>
      <h1>{medRecord}</h1>
    </Fragment>
  );
};

export default ViewMedicalRecord;
