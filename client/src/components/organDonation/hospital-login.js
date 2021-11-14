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
import OrganHeader from './OrganHeader';

const initialState = {
  username: '',
  password: '',
  errMsg: '',
};

const HospitalLogin = () => {
  const [formData, setFormData] = useState(initialState);

  const onSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData, errMsg: '' });

    const { username, password } = formData;
    const user = { username, password };

    axios
      .post('/api/hospitals/login', user)
      .then((res) => {
        localStorage.setItem('isAuthenticated', 'true');
        window.localStorage.setItem('token', res.data.token);
        window.location = '/';
      })
      .catch((err) => setFormData({ ...formData, errMsg: err.message }));
  };

  const onChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.value });
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={6}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Hospital Log In
            </Header>
            <Divider />
            <Form onSubmit={onSubmit} error={!!formData.errMsg}>
              <Form.Input
                value={formData.username}
                onChange={onChange}
                name='username'
                label='Username'
                placeholder='Username'
                required
              />
              <Form.Input
                value={formData.password}
                onChange={onChange}
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
                required
              />
              <Message error header='Oops!' content={formData.errMsg} />
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
