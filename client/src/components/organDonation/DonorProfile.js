import React, { useState, useEffect } from 'react';
import {
  Card,
  Header,
  Divider,
  Image,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';
import axios from 'axios';
import { SERVER_URL } from './url';
import OrganHeader from './OrganHeader';

const initialState = {
  donor: '',
  recipient: '',
  hospital: '',
  matchFound: false,
  loading: true,
};

const initialBlockchainData = {
  OrganInstance: undefined,
  account: null,
  web3: null,
};

const DonorProfile = () => {
  const [profileState, setProfileState] = useState(initialState);
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

        let donorObj = {};
        let recipientObj = {};
        let hospitalObj = {};

        await instance.methods
          .getDonor(accounts[0])
          .call()
          .then(async (value) => {
            ipfs.cat(value[0]).then((data) => {
              const val = JSON.parse(data);

              val.donorId = accounts[0];
              val.organ = value[1];
              val.bloodgroup = value[2];
              donorObj = {
                donor: val,
                matchFound: value[3],
                recipientId: value[4],
              };
              if (value[4] === '0x0000000000000000000000000000000000000000') {
                return setProfileState({
                  ...profileState,
                  ...donorObj,
                  loading: false,
                });
              }
            });

            if (value[4] !== '0x0000000000000000000000000000000000000000') {
              const recipient = await instance.methods
                .getRecipient(value[4])
                .call();
              const res = await ipfs.cat(recipient[1]);
              let temp = JSON.parse(res.toString());
              let data = JSON.stringify({
                fname: temp['fname'],
                lname: temp['lname'],
                gender: temp['gender'],
                city: temp['city'],
                phone: temp['phone'],
                email: temp['email'],
                recipient: value[4],
                organ: recipient[2],
                bloodgroup: recipient[3],
              });
              recipientObj = {
                recipient: JSON.parse(data),
                matchFound: true,
              };

              try {
                const res = await axios.get(
                  `${SERVER_URL}/api/hospitals/profile/${recipient[0]}`
                );
                hospitalObj = { hospital: res.data };
                setProfileState({
                  ...profileState,
                  ...donorObj,
                  ...recipientObj,
                  ...hospitalObj,
                  loading: false,
                });
              } catch (err) {
                console.log('Error => ' + err);
                setProfileState({ ...profileState, loading: false });
              }
            }
          })
          .catch((err) => {
            console.log('Something went wrong', err);
            setProfileState({ ...profileState, loading: false });
          });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        setProfileState({ ...profileState, loading: false });
        console.error(error);
      }
    };

    if (!boolVal) {
      loadBlockchain();
      setBoolVal(true);
    }
  }, [blockchainData, boolVal, profileState]);

  return (
    <div>
      <OrganHeader />
      <div>
        {profileState.loading ? (
          <Dimmer active={profileState.loading} inverted>
            <Loader size='massive'>Loading</Loader>
          </Dimmer>
        ) : (
          <Card.Group
            centered
            style={{ marginTop: '20px', overflowWrap: 'break-word' }}
          >
            <Card style={{ width: '350px' }}>
              <Card.Content>
                <Card.Header style={{ textAlign: 'center' }}>
                  {profileState.donor.fname} {profileState.donor.lname}
                </Card.Header>
                <Card.Meta style={{ textAlign: 'center' }}>
                  {profileState.donor.donorId}
                </Card.Meta>
                <Divider />
                <Card.Description
                  style={{ fontSize: '16px', marginLeft: '30px' }}
                >
                  <strong>Gender : </strong> {profileState.donor.gender} <br />
                  <br />
                  <strong>Organ : </strong> {profileState.donor.organ} <br />
                  <br />
                  <strong>Blood Group : </strong>{' '}
                  {profileState.donor.bloodgroup} <br />
                  <br />
                  <strong>City : </strong> {profileState.donor.city} <br />
                  <br />
                  <strong>Email : </strong> {profileState.donor.email} <br />
                  <br />
                  <strong>Contact : </strong> {profileState.donor.phone} <br />
                </Card.Description>
              </Card.Content>
              <Card.Content extra style={{ textAlign: 'center' }}>
                <Header as='h3' color='grey'>
                  Donor
                </Header>
              </Card.Content>
            </Card>
            {!profileState.matchFound ? (
              <Card style={{ width: '350px' }}>
                <Card.Content>
                  <Header as='h3' color='grey'>
                    No Match Found Yet
                  </Header>
                </Card.Content>
              </Card>
            ) : (
              <Card style={{ width: '350px' }}>
                <Image
                  src={`../../images/${profileState.hospital.img}`}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header style={{ textAlign: 'center' }}>
                    {profileState.hospital.username}{' '}
                  </Card.Header>
                  <Card.Meta style={{ textAlign: 'center' }}>
                    {profileState.hospital.hospitalpublickey}
                  </Card.Meta>
                  <Divider />
                  <Card.Description
                    style={{ fontSize: '16px', marginLeft: '30px' }}
                  >
                    <strong>Address : </strong> {profileState.hospital.address}{' '}
                    <br />
                    <br />
                    <strong>City : </strong> {profileState.hospital.city} <br />
                    <br />
                    <strong>Contact : </strong> {profileState.hospital.contact}{' '}
                    <br />
                    <br />
                  </Card.Description>
                </Card.Content>
                <Card.Content extra style={{ textAlign: 'center' }}>
                  <Header as='h3' color='grey'>
                    Hospital
                  </Header>
                </Card.Content>
              </Card>
            )}
            {!profileState.matchFound ? (
              <Card style={{ width: '350px' }}>
                <Card.Content>
                  <Header as='h3' color='grey'>
                    {' '}
                    No Match Found Yet
                  </Header>
                </Card.Content>
              </Card>
            ) : (
              <Card style={{ width: '350px' }}>
                <Card.Content>
                  <Card.Header style={{ textAlign: 'center' }}>
                    {profileState.recipient.fname}{' '}
                    {profileState.recipient.lname}
                  </Card.Header>
                  <Card.Meta style={{ textAlign: 'center' }}>
                    {profileState.recipient.recipientId}
                  </Card.Meta>
                  <Divider />
                  <Card.Description
                    style={{ fontSize: '16px', marginLeft: '30px' }}
                  >
                    <strong>Gender : </strong> {profileState.recipient.gender}{' '}
                    <br />
                    <br />
                    <strong>Organ : </strong> {profileState.recipient.organ}{' '}
                    <br />
                    <br />
                    <strong>Blood Group : </strong>{' '}
                    {profileState.recipient.bloodgroup} <br />
                    <br />
                    <strong>City : </strong> {profileState.recipient.city}{' '}
                    <br />
                    <br />
                    <strong>Email : </strong> {profileState.recipient.email}{' '}
                    <br />
                    <br />
                    <strong>Contact : </strong> {profileState.recipient.phone}{' '}
                    <br />
                  </Card.Description>
                </Card.Content>
                <Card.Content extra style={{ textAlign: 'center' }}>
                  <Header as='h3' color='grey'>
                    Recipient
                  </Header>
                </Card.Content>
              </Card>
            )}
          </Card.Group>
        )}
      </div>
    </div>
  );
};

export default DonorProfile;
