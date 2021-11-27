import React, { useState, useEffect } from 'react';
import {
  Grid,
  Form,
  Segment,
  Header,
  Button,
  Divider,
  Message,
} from 'semantic-ui-react';
import axios from 'axios';
import { SERVER_URL } from './url';
import ipfs from '../../ipfs';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import OrganHeader from './OrganHeader';
import swal from 'sweetalert';

const initialData = {
  fname: '',
  lname: '',
  email: '',
  donorId: '',
  buffer: null,
  ipfsHash: '',
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

const ApproveDonor = () => {
  const [boolVal, setBoolVal] = useState(false);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [donorData, setDonorData] = useState(initialData);

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
        // console.log(deployedNetwork.address);
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

  const onChange = (event) => {
    setDonorData({ ...donorData, [event.target.name]: event.target.value });
  };

  const captureFile = (event) => {
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setDonorData({ ...donorData, buffer: Buffer(reader.result) });
    };
  };

  const onApprove = (event) => {
    event.preventDefault();

    setDonorData({ ...donorData, errMsg: '', successMsg: '' });

    const { fname, lname, email, buffer, donorId } = donorData;

    axios
      .get(`${SERVER_URL}/api/donors/${email}`)
      .then(async (res) => {
        setDonorData({ loading: true });
        // console.log(res.data);
        const { gender, city, phone, email, organ, bloodgroup } = res.data;

        const data = JSON.stringify({
          fname,
          lname,
          gender,
          city,
          phone,
          email,
        });

        // const buf = Buffer.from(data);

        const result = await ipfs.add(data);
        setDonorData({ ...donorData, ipfsHash: result });

        const result1 = await ipfs.add(buffer);
        setDonorData({ ...donorData, EMRHash: result1 });

        try {
          // console.log('hello');
          await blockchainData.OrganInstance.methods
            .addDonor(
              donorId,
              result,
              result1,
              organ,
              bloodgroup
            )
            .send({
              from: blockchainData.account,
            });
          // setDonorData({ ...donorData, successMsg: 'Donor Approved !' });
          swal({
            title: 'Success',
            text: 'Donor Approved Successfully',
            icon: 'success',
            button: 'ok',
          }).then(() => setDonorData(initialData));

          // console.log('hello');
        } catch (err) {
          setDonorData({ ...donorData, errMsg: err.message });
          console.log(err);
        }
        setDonorData({ ...donorData, loading: false });
      })
      .catch((err) => setDonorData({ ...donorData, errMsg: err.message }));
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={6}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Approve Donor
            </Header>
            <Divider />
            <Form
              onSubmit={onApprove}
              error={!!donorData.errMsg}
              success={!!donorData.successMsg}
            >
              <Form.Input
                value={donorData.fname}
                onChange={onChange}
                name='fname'
                label='First Name'
                placeholder='First Name'
                required
              />
              <Form.Input
                value={donorData.lname}
                onChange={onChange}
                name='lname'
                label='Last Name'
                placeholder='Last Name'
                required
              />
              <Form.Input
                value={donorData.email}
                onChange={onChange}
                name='email'
                label='Email'
                placeholder='Email'
                type='email'
                required
              />
              <Form.Input
                value={donorData.donorId}
                onChange={onChange}
                name='donorId'
                label='Donor Public Key'
                placeholder='Donor Public Key'
                required
              />
              <Form.Input
                onChange={captureFile}
                name='EMR'
                label='EMR'
                type='file'
                required
              />
              <Message error header='Oops!' content={donorData.errMsg} />
              <Message success header='Sucess' content={donorData.successMsg} />
              <Segment basic textAlign={'center'}>
                <Button loading={donorData.loading} positive type='submit'>
                  Approve
                </Button>
              </Segment>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ApproveDonor;
