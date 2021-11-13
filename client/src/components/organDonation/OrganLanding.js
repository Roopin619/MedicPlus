import React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import OrganHeader from './OrganHeader';

const OrganLanding = () => {
  return (
    <div >
      <OrganHeader />
      {/* <img className="home" src={'../images/home.png'} width="1400" alt="Not Found" /> */}
      <div id="landing-header">
        <Segment basic textAlign={"center"}>
          <Button positive as={Link} style={{ marginTop: "50px" }} to="/organ-donation/donor-signup">
            <p style={{ fontSize: "20px" }}><Icon name="heartbeat" />BE A DONOR</p><p>Click Here !</p>
          </Button>
        </Segment>
      </div>
    </div>
  )
}

export default OrganLanding;
