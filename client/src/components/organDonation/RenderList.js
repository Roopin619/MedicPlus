import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Divider,
  Header,
  Portal,
  Segment,
} from 'semantic-ui-react';
import OrganContract from '../../contracts/OrganChain.json';
import getWeb3 from '../../getWeb3';
import ipfs from '../../ipfs';

const initialState = {
  fname: '',
  lname: '',
  donorId: '',
  gender: '',
  bloodgroup: '',
  organ: '',
  email: '',
  contact: '',
  city: '',
  donorFound: false,
  loading: false,
};

// const initialBlockchainData = {
//   OrganInstance: undefined,
//   account: null,
//   web3: null,
// };

const RenderList = (props) => {
  const { blockchainData } = props;
  const [donorData, setDonorData] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [donorFound, setDonorFound] = useState(false);
  // const [boolVal, setBoolVal] = useState(false);
  // const [blockchainData, setBlockchainData] = useState(initialBlockchainData);

  // useEffect(() => {
  //   // FOR REFRESHING PAGE ONLY ONCE -
  //   if (!window.location.hash) {
  //     window.location = window.location + '#loaded';
  //     window.location.reload();
  //   }
  //   const loadBlockchain = async () => {
  //     try {
  //       // Get network provider and web3 instance.
  //       const web3 = await getWeb3();

  //       // Use web3 to get the user's accounts.
  //       const accounts = await web3.eth.getAccounts();

  //       // Get the contract instance.
  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = OrganContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         OrganContract.abi,
  //         deployedNetwork && deployedNetwork.address
  //       );

  //       // Set web3, accounts, and contract to the state, and then proceed with an
  //       // example of interacting with the contract's methods.

  //       setBlockchainData({
  //         ...blockchainData,
  //         OrganInstance: instance,
  //         web3: web3,
  //         account: accounts[0],
  //       });
  //     } catch (error) {
  //       // Catch any errors for any of the above operations.
  //       alert(
  //         `Failed to load web3, accounts, or contract. Check console for details.`
  //       );
  //       console.error(error);
  //     }
  //   };

  //   if (!boolVal) {
  //     loadBlockchain();
  //     setBoolVal(true);
  //   }
  // }, [blockchainData, boolVal]);

  const onMatch = async () => {
    setDonorData({ ...donorData, loading: true });

    try {
      await blockchainData.OrganInstance.methods
        .transplantMatch(props.recipient.recipientId)
        .send({
          from: blockchainData.account,
        });

      const result = await blockchainData.OrganInstance.methods
        .isMatchFound(props.recipient.recipientId)
        .call();
      if (result === false) {
        // alert('Match not found');
        setOpen(true);
        throw Object.assign(new Error('Match Not Found!'));
      } else {
        const donorId = await blockchainData.OrganInstance.methods
          .getMatchedDonor(props.recipient.recipientId)
          .call();
        const donor = await blockchainData.OrganInstance.methods
          .getDonor(donorId)
          .call();
        // setDonorData({
        //   ...donorData,
        //   donorId: donorId,
        //   organ: donor[1],
        //   bloodgroup: donor[2],
        // });

        const res = await ipfs.cat(donor[0]);
        const temp = JSON.parse(res.toString());
        console.log(temp);
        return setDonorData({
          ...donorData,
          donorId: donorId,
          organ: donor[1],
          bloodgroup: donor[2],
          fname: temp['fname'],
          lname: temp['lname'],
          gender: temp['gender'],
          email: temp['email'],
          contact: temp['phone'],
          city: temp['city'],
          donorFound: true,
        });
        // setDonorFound(true);
        // setOpen(true);
        // setOpenMsg('Match Found!!');
      }
    } catch (err) {
      console.log(err);
      // setDonorData({ ...donorData, open: true });
    }
    setDonorData({ ...donorData, loading: false });
  };

  const handleClose = () => setOpen(false);
  console.log(donorData);
  return (
    <div>
      <Card.Group centered>
        {!donorData.donorFound ? null : (
          <Card style={{ width: '375px' }}>
            <Card.Content>
              <Card.Header style={{ textAlign: 'center' }}>
                {donorData.fname} {donorData.lname}
              </Card.Header>
              <Card.Meta style={{ textAlign: 'center' }}>
                {donorData.donorId}
              </Card.Meta>
              <Divider />
              <Card.Description
                style={{ fontSize: '16px', marginLeft: '30px' }}
              >
                <strong>Gender : </strong> {donorData.gender} <br />
                <br />
                <strong>Organ : </strong> {donorData.organ} <br />
                <br />
                <strong>Blood Group : </strong> {donorData.bloodgroup} <br />
                <br />
                <strong>City : </strong> {donorData.city} <br />
                <br />
                <strong>Email : </strong> {donorData.email} <br />
                <br />
                <strong>Contact : </strong> {donorData.contact} <br />
              </Card.Description>
            </Card.Content>
            <Card.Content extra style={{ textAlign: 'center' }}>
              <Header as='h3' color='grey'>
                Donor
              </Header>
            </Card.Content>
          </Card>
        )}
        <Card style={{ width: '375px' }}>
          <Card.Content>
            <Card.Header style={{ textAlign: 'center' }}>
              {props.recipient.fname} {props.recipient.lname}
            </Card.Header>
            <Card.Meta style={{ textAlign: 'center' }}>
              {props.recipient.recipientId}
            </Card.Meta>
            <Divider />
            <Card.Description style={{ fontSize: '16px', marginLeft: '30px' }}>
              <strong>Gender : </strong> {props.recipient.gender} <br />
              <br />
              <strong>Organ : </strong> {props.recipient.organ} <br />
              <br />
              <strong>Blood Group : </strong> {props.recipient.bloodgroup}{' '}
              <br />
              <br />
              <strong>City : </strong> {props.recipient.city} <br />
              <br />
              <strong>Email : </strong> {props.recipient.email} <br />
              <br />
              <strong>Contact : </strong> {props.recipient.contact} <br />
              <br />
            </Card.Description>
          </Card.Content>
          <Portal onClose={handleClose} open={open}>
            <Segment
              style={{
                left: '40%',
                position: 'fixed',
                top: '50%',
                zIndex: 1000,
              }}
            >
              <Header>Sorry, No Match Found!</Header>
              <Button content='OK' negative onClick={handleClose} />
            </Segment>
          </Portal>
          <Card.Content extra style={{ textAlign: 'center' }}>
            {donorData.donorFound ? (
              <Header as='h3' color='grey'>
                Recipient
              </Header>
            ) : (
              <Button
                loading={donorData.loading}
                content='Match'
                positive
                onClick={onMatch}
              />
            )}
          </Card.Content>
        </Card>
      </Card.Group>
    </div>
  );
};

export default RenderList;
