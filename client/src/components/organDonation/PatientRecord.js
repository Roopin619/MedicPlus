import React, { useState, useEffect } from 'react';
import {
  Grid,
  Form,
  Segment,
  Header,
  Button,
  Icon,
  Divider,
  Message,
} from 'semantic-ui-react';
import OrganHeader from './OrganHeader';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';

const initialState = {
  publicKey: '',
  ipfsHash: '',
  loading: false,
  errMsg: '',
};

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const PatientRecord = () => {
  const [record, setRecord] = useState(initialState);
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

  const onChange = (event) => {
    setRecord({ ...record, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setRecord({ ...record, loading: true, errMsg: '' });

    try {
      const ipfsHash = await blockchainData.OrganInstance.methods
        .getEMR(record.publicKey)
        .call();
      if (!ipfsHash) throw Object.assign(new Error("Patient Doesn't Exists!"));
      setRecord({ ...record, ipfsHash, loading: false });
    } catch (err) {
      setRecord({ ...record, errMsg: err.message, loading: false });
    }
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={6}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Get Patient's EMR
            </Header>
            <Divider />
            <Form onSubmit={onSubmit} error={!!record.errMsg}>
              <Form.Input
                value={record.publicKey}
                onChange={onChange}
                name='publicKey'
                label='Public Key'
                placeholder='Public Key'
                required
              />
              <Message error header='Oops!' content={record.errMsg} />
              <Segment basic textAlign={'center'}>
                <Button loading={record.loading} positive type='submit'>
                  Get EMR
                </Button>
              </Segment>
            </Form>
            <Segment basic textAlign={'center'}>
              {record.ipfsHash ? (
                <Button
                  primary
                  style={{ textAlign: 'center' }}
                  href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
                  target='_blank'
                >
                  <Icon name='download' /> Download EMR
                </Button>
              ) : null}
            </Segment>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default PatientRecord;
