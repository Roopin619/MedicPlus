import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import swal from 'sweetalert';
import {
  Form,
  Button,
  Grid,
  Segment,
  Header,
  Divider,
  Message,
} from 'semantic-ui-react';
import OrganHeader from './OrganHeader';

const initialState = {
  fname: '',
  lname: '',
  gender: 'Male',
  city: 'Gwalior',
  phone: '',
  email: '',
  bloodgroup: 'A+',
  organ: 'Eyes',
  donorPublicKey: '',
  errMsg: '',
};

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const DonorSignUp = () => {
  const history = useHistory();
  const [boolVal, setBoolVal] = useState(false);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [formData, setFormData] = useState(initialState);

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
        // console.log()
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = OrganContract.networks[networkId];
        console.log(deployedNetwork.address);
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
  }, [blockchainData, boolVal, history]);

  const onSubmit = async (event) => {
    event.preventDefault();

    setFormData({ ...formData, errMsg: '' });

    const {
      fname,
      lname,
      gender,
      city,
      phone,
      email,
      bloodgroup,
      organ,
      donorPublicKey,
    } = formData;
    const donor = {
      fname,
      lname,
      gender,
      city,
      phone,
      email,
      bloodgroup,
      organ,
    };

    const infoStr = JSON.stringify(donor);
    console.log(blockchainData.OrganInstance);
    await ipfs.add(infoStr).then(async (hash) => {
      try {
        await blockchainData.OrganInstance.methods
          .addDonor(blockchainData.account, hash, hash, organ, bloodgroup)
          .call();
        swal({
          title: 'Success',
          text: 'Donor Registered Successfully',
          icon: 'success',
          button: 'ok',
        });
      } catch (err) {
        console.log(err);
        // swal({
        //   title: 'Error',
        //   text: 'Some Error Occured',
        //   icon: 'error',
        //   button: 'ok',
        // });
      }
    });

    // axios
    //   .post('/api/donors', donor)
    //   .then((res) => {
    //     console.log('Donor Added Successfully');
    //     window.location = '/hospital-list/' + city;
    //   })
    //   .catch((err) => setFormData({ ...formData, errMsg: err.message }));
  };

  const onChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.value });
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={9}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              New Donor? PLease Sign Up Here!
            </Header>
            <Divider />
            <Form onSubmit={onSubmit} error={!!formData.errMsg}>
              <Form.Group widths={2}>
                <Form.Input
                  value={formData.fname}
                  onChange={onChange}
                  name='fname'
                  label='First name'
                  placeholder='First name'
                  required
                />
                <Form.Input
                  value={formData.lname}
                  onChange={onChange}
                  name='lname'
                  label='Last name'
                  placeholder='Last name'
                  required
                />
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Field
                  value={formData.gender}
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
                  value={formData.city}
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
                  value={formData.phone}
                  onChange={onChange}
                  name='phone'
                  label='Phone'
                  placeholder='Phone'
                  required
                />
                <Form.Input
                  value={formData.email}
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
                  value={formData.bloodgroup}
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
                  value={formData.organ}
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
                  <option value='Longs'>Lungs</option>
                  <option value='Pancreas'>Pancreas</option>
                </Form.Field>
              </Form.Group>
              {/**<Form.Input
                value={formData.donorPublicKey}
                onChange={onChange}
                name='donorPublicKey'
                label='Donor Id'
                placeholder='Donor Id'
                required
              /> */}
              <Message error header='Oops!' content={formData.errMsg} />
              <Segment basic textAlign={'center'}>
                <Button positive type='submit'>
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

export default DonorSignUp;
