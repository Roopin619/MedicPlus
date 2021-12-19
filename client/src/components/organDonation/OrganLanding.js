import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import OrganHeader from './OrganHeader';
import donation_panel from '../../images/donation_panel.jpg';
import '../../styles/OrganLanding.css';

const OrganLanding = () => {
  return (
    <div className='organDonation-landing'>
      <OrganHeader />
      {/* <img className="home" src={'../images/home.png'} width="1400" alt="Not Found" /> */}
      <div className='organLanding-contentDiv'>
        {/**<div className='organLanding-imgDiv'>
          <img
            src={donation_panel}
            alt='organ-donation'
            className='organLanding-img'
          />
        </div> */}
        <div className='organLanding-buttonDiv'>
          <Button
            positive
            as={Link}
            style={{ marginTop: '50px' }}
            to='/organ-donation/donor-signup'
          >
            <p style={{ fontSize: '20px' }}>
              <Icon name='heartbeat' />
              BE A DONOR
            </p>
            <p>Click Here !</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganLanding;
