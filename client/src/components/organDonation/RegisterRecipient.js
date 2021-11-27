import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Grid,
  Segment,
  Header,
  Divider,
  Message,
} from 'semantic-ui-react';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import jwtDecode from 'jwt-decode';
import OrganHeader from './OrganHeader';
import swal from 'sweetalert';

const initialState = {
  fname: '',
  lname: '',
  gender: 'Male',
  city: 'Gwalior',
  phone: '',
  email: '',
  bloodgroup: 'A+',
  organ: 'Eyes',
  buffer: null,
  ipfsHash: '',
  publicKey: '',
  EMRHash: '',
  loading: false,
  errMsg: '',
  successMsg: '',
};

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const RegisterRecipient = () => {
  const [recipientData, setRecipientData] = useState(initialState);
  const [boolVal, setBoolVal] = useState(false);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);

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
        const deployedNetwork = OrganContract.networks[networkId];
        const instance = new web3.eth.Contract(
          OrganContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        setBlockchainData({
          ...blockchainData,
          OrganInstance: instance,
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

  const onSubmit = async (event) => {
    event.preventDefault();

    setRecipientData({
      ...recipientData,
      loading: true,
      errMsg: '',
      successMsg: '',
    });

    const {
      fname,
      lname,
      gender,
      city,
      phone,
      email,
      bloodgroup,
      organ,
      buffer,
      publicKey,
    } = recipientData;

    try {
      const data = JSON.stringify({ fname, lname, gender, city, phone, email });

      var result = await ipfs.add(data);
      setRecipientData({ ...recipientData, ipfsHash: result });

      var result1 = await ipfs.add(buffer);
      setRecipientData({ ...recipientData, EMRHash: result1 });

      const hospital = await jwtDecode(window.localStorage.getItem('token'));

      await blockchainData.OrganInstance.methods
        .addRecipient(
          publicKey,
          hospital.hospital.hospitalpublickey,
          result,
          result1,
          organ,
          bloodgroup
        )
        .send({
          from: blockchainData.account,
        });
      swal({
        title: 'Success',
        text: 'Recipient Registered Successfully!',
        icon: 'success',
        button: 'ok',
      }).then(() => setRecipientData(initialState));
    } catch (err) {
      swal({
        title: 'Error',
        text: 'Something went wrong!',
        icon: 'error',
        button: 'ok',
      }).then(() => window.location.reload());
    }
    setRecipientData({ ...recipientData, loading: false });
  };

  const captureFile = (event) => {
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setRecipientData({ ...recipientData, buffer: Buffer(reader.result) });
    };
  };

  const onChange = (event) => {
    setRecipientData({
      ...recipientData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={9}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Register New Recipient
            </Header>
            <Divider />
            <Form
              onSubmit={onSubmit}
              error={!!recipientData.errMsg}
              success={!!recipientData.successMsg}
            >
              <Form.Group widths={2}>
                <Form.Input
                  value={recipientData.fname}
                  onChange={onChange}
                  name='fname'
                  label='First name'
                  placeholder='First name'
                  required
                />
                <Form.Input
                  value={recipientData.lname}
                  onChange={onChange}
                  name='lname'
                  label='Last name'
                  placeholder='Last name'
                  required
                />
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Field
                  value={recipientData.gender}
                  onChange={onChange}
                  name='gender'
                  label='Gender'
                  control='select'
                  required
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                </Form.Field>
                <Form.Field
                  value={recipientData.city}
                  onChange={onChange}
                  name='city'
                  label='City'
                  control='select'
                  required
                >
                  <option value='Gwalior'>Gwalior</option>
                  <option value='New Delhi'>New Delhi</option>
                  <option value='Pune'>Pune</option>
                </Form.Field>
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Input
                  value={recipientData.phone}
                  onChange={onChange}
                  name='phone'
                  label='Phone'
                  placeholder='Phone'
                  required
                />
                <Form.Input
                  value={recipientData.email}
                  onChange={onChange}
                  name='email'
                  type='email'
                  label='Email'
                  placeholder='Email'
                  required
                />
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Field
                  value={recipientData.bloodgroup}
                  onChange={onChange}
                  name='bloodgroup'
                  label='Blood Group'
                  control='select'
                  required
                >
                  <option value='A+'>A+</option>
                  <option value='A-'>A-</option>
                  <option value='B+'>B+</option>
                  <option value='B-'>B-</option>
                  <option value='AB+'>AB+</option>
                  <option value='AB-'>AB-</option>
                  <option value='O+'>O+</option>
                  <option value='O-'>O-</option>
                </Form.Field>
                <Form.Field
                  value={recipientData.organ}
                  onChange={onChange}
                  name='organ'
                  label='Organ'
                  control='select'
                  required
                >
                  <option value='Eyes'>Eyes</option>
                  <option value='Heart'>Heart</option>
                  <option value='Kidney'>Kidney</option>
                  <option value='Liver'>Liver</option>
                  <option value='Lungs'>Lungs</option>
                  <option value='Pancreas'>Pancreas</option>
                </Form.Field>
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Input
                  value={recipientData.publicKey}
                  onChange={onChange}
                  name='publicKey'
                  label="Recipient's Public Key"
                  placeholder="Recipient's Public Key"
                  required
                />
                <Form.Input
                  onChange={captureFile}
                  name='EMR'
                  label='EMR'
                  type='file'
                  required
                />
              </Form.Group>
              <Message error header='Oops!' content={recipientData.errMsg} />
              <Message
                success
                header='Success'
                content={recipientData.successMsg}
              />
              <Segment basic textAlign={'center'}>
                <Button loading={recipientData.loading} positive type='submit'>
                  Submit
                </Button>
              </Segment>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default RegisterRecipient;
