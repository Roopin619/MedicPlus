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
  patientId: '',
  gender: '',
};

const initialBlockchainData = {
  EHRInstance: undefined,
  account: null,
  web3: null,
  isPatient: false,
};

const EditPatientInfo = () => {
  const history = useHistory();
  // const [patientDetails, setPatientDetails] = useState(initialData);
  const [changes, setChanges] = useState(initialData);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [boolVal, setBoolVal] = useState(false);

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

        setBlockchainData({
          ...blockchainData,
          EHRInstance: instance,
          web3: web3,
          account: accounts[0],
        });

        const isPatient = await instance.methods.isPatient(accounts[0]).call();

        if (isPatient) {
          await instance.methods
            .getPatientInfoByAddress(accounts[0])
            .call()
            .then((value) => {
              ipfs.cat(value).then((data) => {
                const val = JSON.parse(data);
                // setPatientDetails(val);
                setChanges(val);
              });
            })
            .catch((err) => {
              alert('Error in finding patient information');
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

  // console.log(patientDetails);

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
        // console.log(blockchainData);
        await blockchainData.EHRInstance.methods
          .updatePatientInfo(changes.patientId, hash)
          .send({ from: blockchainData.account });
        swal({
          title: 'Success',
          text: 'Patient Details Updated Successfully',
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
        <h1 className='viewDoctorInfo-title'>Edit Patient's Information</h1>
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
            type='text'
            name='gender'
            placeholder='Gender'
            value={changes.gender}
            onChange={handleChange}
          />
        </div>
        <div className='viewDoctorInfo-form-row-wise'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={changes.email}
            onChange={handleChange}
          />
          <input
            type='tel'
            name='mobileNo'
            placeholder='Mobile Number'
            value={changes.mobileNo}
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

export default EditPatientInfo;
