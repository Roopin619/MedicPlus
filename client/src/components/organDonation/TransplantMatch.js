import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Grid, Divider, Dimmer, Loader } from 'semantic-ui-react';
import OrganContract from '../../contracts/OrganChain.json';
import OrganHeader from './OrganHeader';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import RenderList from './RenderList';

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const TransplantMatch = () => {
  const [recipientsData, setRecipientsData] = useState({
    recipient_arr: [],
    loading: true,
  });
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

        const hospital = jwtDecode(window.localStorage.getItem('token'));
        const hospitalId = hospital.hospital.hospitalpublickey;
        const recipientCount = await instance.methods
          .getRecipientCount(hospitalId)
          .call();
        var recipient_arr = [];
        for (let i = 0; i < recipientCount; i++) {
          var recipient = await instance.methods
            .getRecipientDetail(hospitalId, i)
            .call();
          if (recipient[1] === '') continue;
          const res = await ipfs.cat(recipient[1]);
          const temp = JSON.parse(res.toString());
          const data = JSON.stringify({
            fname: temp['fname'],
            lname: temp['lname'],
            gender: temp['gender'],
            city: temp['city'],
            contact: temp['phone'],
            email: temp['email'],
            recipientId: recipient[0],
            organ: recipient[2],
            bloodgroup: recipient[3],
          });
          const element = JSON.parse(data);
          recipient_arr.push(element);
        }
        setRecipientsData({ ...recipientsData, recipient_arr, loading: false });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          'Failed to load web3, accounts, or contract. Check console for details.'
        );
        console.error(error);
        setRecipientsData({ ...recipientsData, loading: false });
      }
    };

    if (!boolVal) {
      loadBlockchain();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, recipientsData]);

  const renderList = () => {
    const List = recipientsData.recipient_arr.map((recipient) => {
      return (
        <div key={recipient.recipientId}>
          <RenderList recipient={recipient} blockchainData={blockchainData} />
          <Divider />
        </div>
      );
    });
    return <div>{List}</div>;
  };

  return (
    <div>
      <OrganHeader />
      {recipientsData.loading ? (
        <Dimmer active={recipientsData.loading} inverted>
          <Loader size='massive'>Loading</Loader>
        </Dimmer>
      ) : (
        <Grid centered columns={2} style={{ marginTop: '10px' }}>
          <Grid.Column width={11}>{renderList()}</Grid.Column>
        </Grid>
      )}
    </div>
  );
};

export default TransplantMatch;
