import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import swal from 'sweetalert';

import '../../styles/Admin.css';

const initialData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
};

const Admin = () => {
  const history = useHistory();
  const [isActive, setIsActive] = useState(false);
  const [blockchainData, setBlockchainData] = useState(initialData);
  const [boolVal, setBoolVal] = useState(false);

  useEffect(() => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    const checkAdmin = async () => {
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

        const adminId = await instance.methods.getAdmin().call();

        if (accounts[0] === adminId) {
          setBlockchainData({
            ...blockchainData,
            EHRInstance: instance,
            web3: web3,
            account: accounts[0],
          });
        } else {
          swal({
            title: 'Access Deneid',
            text: 'Only Admin have acess to this page',
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
      checkAdmin();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, history]);

  return (
    <div>
      <div className='admin-header'>
        <div className='dropdown'>
          <div className='dropdown-btn' onClick={() => setIsActive(!isActive)}>
            Admin
          </div>
          {isActive && (
            <div className='dropdown-content'>
              <div
                className='dropdown-item'
                onClick={() => history.push('/addDoctor')}
              >
                Add Doctor
              </div>
              <div
                className='dropdown-item'
                onClick={() => history.push('/addPatient')}
              >
                Add Patient
              </div>
              {/**<div
                className='dropdown-item'
                onClick={() => history.push('/deleteUser')}
              >
                Delete User
              </div> */}
            </div>
          )}
        </div>
        <div className='dropdown-btn' onClick={() => history.push('/')}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Admin;
