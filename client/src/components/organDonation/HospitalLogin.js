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
import axios from 'axios';
import { SERVER_URL } from './url';
import OrganHeader from './OrganHeader';

const HospitalLogin = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    errMsg: '',
  });

  const onSubmit = (event) => {
    event.preventDefault();

    setLoginData({ ...loginData, errMsg: '' });

    const user = { username: loginData.username, password: loginData.password };

    axios
      .post(`${SERVER_URL}/api/hospitals/login`, user)
      .then((res) => {
        localStorage.setItem('isAuthenticated', 'true');
        window.localStorage.setItem('token', res.data.token);
        window.location = '/organ-donation';
      })
      .catch((err) => setLoginData({ ...loginData, errMsg: err.message }));
  };

  const onChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  return (
    <div className='organDonation-background'>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={6}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Hospital Log In
            </Header>
            <Divider />
            <Form onSubmit={onSubmit} error={!!loginData.errMsg}>
              <Form.Input
                value={loginData.username}
                onChange={onChange}
                name='username'
                label='Username'
                placeholder='Username'
                required
              />
              <Form.Input
                value={loginData.password}
                onChange={onChange}
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
                required
              />
              <Message error header='Oops!' content={loginData.errMsg} />
              <Segment basic textAlign={'center'}>
                <Button positive style={{ textAlign: 'center' }} type='submit'>
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

export default HospitalLogin;
