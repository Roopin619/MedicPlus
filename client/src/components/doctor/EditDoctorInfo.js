import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EHRContract from '../../contracts/EHR.json';
import getWeb3 from '../../getWeb3';
import swal from 'sweetalert';
import ipfs from '../../ipfs';

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
};

const EditDoctorInfo = () => {
  const history = useHistory();
  // const [doctorDetails, setDoctorDetails] = useState(initialData);
  const [changes, setChanges] = useState(initialData);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);

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

        setBlockchainData({
          ...blockchainData,
          EHRInstance: instance,
          web3: web3,
          account: accounts[0],
        });

        const isDoctor = await instance.methods.isDoctor(accounts[0]).call();

        if (isDoctor) {
          await instance.methods
            .getDoctorInfoByAddress(accounts[0])
            .call()
            .then((value) => {
              ipfs.cat(value).then((data) => {
                const val = JSON.parse(data);
                // setDoctorDetails(val);
                setChanges(val);
              });
            })
            .catch((err) => {
              alert('Error in finding doctor information');
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

  const handleChange = (e) => {
    const { name } = e.target;
    setChanges({ ...changes, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infoStr = JSON.stringify(changes);
    console.log(infoStr);
    await ipfs.add(infoStr).then(async (hash) => {
      try {
        await blockchainData.EHRInstance.methods
          .updateDoctorInfo(changes.doctorId, hash)
          .send({ from: blockchainData.account });
        swal({
          title: 'Success',
          text: 'Doctor Details Updated Successfully',
          icon: 'success',
          button: 'ok',
        }).then(() => window.location.reload());
      } catch (err) {
        swal({
          title: 'Error',
          text: 'Error in updating details',
          icon: 'error',
          button: 'ok',
        }).then(() => window.location.reload());
      }
    });
  };

  return (
    <div className='viewDoctorInfo-container'>
      <div className='viewDoctorInfo-backButtonDiv'>
        <button
          className='viewDoctorInfo-backButton'
          onClick={() => history.push('/')}
        >
          Cancel
        </button>
      </div>
      <div className='viewDoctorInfo-form-container'>
        <h1 className='viewDoctorInfo-title'>Edit Doctor's Information</h1>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='firstName'
            placeholder='First name'
            value={changes.firstName}
            onChange={handleChange}
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last name'
            value={changes.lastName}
            onChange={handleChange}
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='dob'
            placeholder='Date of Birth'
            value={changes.dob}
            onChange={handleChange}
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={changes.email}
            onChange={handleChange}
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='tel'
            name='mobileNo'
            placeholder='Mobile Number'
            value={changes.mobileNo}
            onChange={handleChange}
          />
          <input
            type='text'
            name='speciality'
            placeholder='Speciality'
            value={changes.speciality}
            onChange={handleChange}
          />
        </div>

        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='text'
            name='city'
            placeholder='City'
            value={changes.city}
            onChange={handleChange}
          />
          <input
            type='text'
            name='state'
            placeholder='State'
            value={changes.state}
            onChange={handleChange}
          />
        </div>
        <div className='addDoctor-buttonDiv'>
          <button className='addDoctor-button' onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorInfo;
