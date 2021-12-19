import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from './url';
import {
  Form,
  Button,
  Grid,
  Segment,
  Header,
  Divider,
  Message,
} from 'semantic-ui-react';
import { useHistory } from 'react-router';
import OrganHeader from './OrganHeader';
import swal from 'sweetalert';

const initialData = {
  fname: '',
  lname: '',
  gender: 'Male',
  city: 'Gwalior',
  phone: '',
  email: '',
  bloodgroup: 'A+',
  organ: 'Eyes',
  errMsg: '',
};

const DonorSignUp = () => {
  const [formData, setFormData] = useState(initialData);
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();

    setFormData({ ...formData, errMsg: '' });

    const { fname, lname, gender, city, phone, email, bloodgroup, organ } =
      formData;
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

    axios
      .post(`${SERVER_URL}/api/donors`, donor)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Donor Registerd Successfully',
          icon: 'success',
          button: 'ok',
        }).then(() => history.push(`/organ-donation/hospital-list/${city}`));
      })
      .catch((err) => setFormData({ ...formData, errMsg: err.message }));
  };

  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className='organDonation-background'>
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
                  <option value='Lungs'>Lungs</option>
                  <option value='Pancreas'>Pancreas</option>
                </Form.Field>
              </Form.Group>
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
