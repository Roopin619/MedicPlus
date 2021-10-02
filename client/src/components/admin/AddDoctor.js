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
  doctorId: '',
  city: '',
  state: '',
  speciality: '',
};

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isAdmin: false,
};

const AddDoctor = () => {
  const history = useHistory();
  const [doctorDetails, setDoctorDetails] = useState(initialData);
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
    setDoctorDetails({ ...doctorDetails, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoStr = JSON.stringify(doctorDetails);
    await ipfs.add(infoStr).then(async (hash) => {
      try {
        await blockchainData.EHRInstance.methods
          .addDoctorInfo(doctorDetails.doctorId, hash)
          .send({ from: blockchainData.account });
        swal({
          title: 'Success',
          text: 'Doctor Registerd Successfully',
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
          <h1 className='addDoctor-title'>Add Doctor </h1>
          <div className='addDoctor-form-row-wise'>
            <input
              type='text'
              className='addDoctor'
              name='firstName'
              placeholder='First name'
              value={doctorDetails.firstName}
              onChange={handleChange}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last name'
              value={doctorDetails.lastName}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise'>
            <input
              type='text'
              name='dob'
              placeholder='Date of Birth'
              value={doctorDetails.dob}
              onChange={handleChange}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={doctorDetails.email}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise'>
            <input
              type='tel'
              name='mobileNo'
              placeholder='Mobile Number'
              value={doctorDetails.mobileNo}
              onChange={handleChange}
            />
            <input
              type='text'
              name='speciality'
              placeholder='Speciality'
              value={doctorDetails.speciality}
              onChange={handleChange}
            />
          </div>

          <div className='addDoctor-form-row-wise'>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={doctorDetails.city}
              onChange={handleChange}
            />
            <input
              type='text'
              name='state'
              placeholder='State'
              value={doctorDetails.state}
              onChange={handleChange}
            />
          </div>
          <div className='addDoctor-form-row-wise '>
            <input
              type='text'
              name='doctorId'
              placeholder='Doctor ID'
              className='lastInput'
              value={doctorDetails.doctorId}
              onChange={handleChange}
            />
          </div>

          <div className='addDoctor-buttonDiv'>
            <button type='submit' className='addDoctor-button'>
              Add Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
