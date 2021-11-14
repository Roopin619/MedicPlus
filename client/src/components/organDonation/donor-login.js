import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import swal from 'sweetalert';
import {
  Grid,
  Segment,
  Header,
  Form,
  Button,
  Divider,
  Message,
} from 'semantic-ui-react';
import OrganHeader from './OrganHeader';
// import OrganChain from '../ethereum/organchain';

const initialState = {
  publicKey: '',
  loading: false,
  errMsg: '',
};

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const DonorLogin = () => {
  const history = useHistory();
  const [boolVal, setBoolVal] = useState(false);
  const [blockchainData, setBlockchainData] = useState(initialBlockchainData);
  const [loginState, setLoginState] = useState(initialState);

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
  }, [blockchainData, boolVal, history]);

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoginState({ loading: true, errMsg: '' });

    const { publicKey } = loginState;
    console.log(publicKey);
    await blockchainData.OrganInstance.methods
      .checkDonor(publicKey)
      .call()
      .then((value) => {
        console.log(value);
        // ipfs.cat(value).then((data) => {
        //   const val = JSON.parse(data);
        //   console.log(val);
        // })
        // setViewInfo(true);
        setLoginState({ ...loginState, loading: false });
      })
      .catch((err) => {
        setLoginState({
          ...loginState,
          loading: false,
          errMsg: 'You are not approved yet OR you are not registred!',
        });
      });

    // try{
    //     const await blockchainData.OrganInstance.methods.getDonor(publicKey).call();
    //     window.location = `/donor/profile/${publicKey}`;
    // }
    // catch(err){
    //     this.setState({ errMsg : "You are not approved yet OR you are not registred!" })
    // }
  };

  const onChange = (e) => {
    const { name } = e.target;
    setLoginState({ ...loginState, [name]: e.target.value });
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={6}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Donor Log In
            </Header>
            <Divider />
            <Form onSubmit={onSubmit} error={!!loginState.errMsg}>
              <Form.Input
                value={loginState.publicKey}
                onChange={onChange}
                name='publicKey'
                label='Public Key'
                placeholder='Public Key'
                required
              />
              <Message error header='Oops!' content={loginState.errMsg} />
              <Segment basic textAlign={'center'}>
                <Button loading={loginState.loading} positive type='submit'>
                  Log In
                </Button>
              </Segment>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default DonorLogin;
