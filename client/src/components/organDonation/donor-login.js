import React, { useState } from 'react';
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

const DonorLogin = () => {
  const [loginState, setLoginState] = useState(initialState);

  const onSubmit = async (event) => {
    event.preventDefault();

    // this.setState( { loading :true , errMsg :'' } );

    // const {publicKey} = this.state;

    // try{
    //     await OrganChain.methods.getDonor(publicKey).call();
    //     window.location = `/donor/profile/${publicKey}`;
    // }
    // catch(err){
    //     this.setState({ errMsg : "You are not approved yet OR you are not registred!" })
    // }
    // this.setState( { loading : false} );
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
