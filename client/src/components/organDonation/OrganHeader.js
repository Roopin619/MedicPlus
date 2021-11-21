import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const Nav = (props) => <NavLink exact {...props} activeClassName='active' />;

const OrganHeader = () => {
  const logout = (event) => {
    window.localStorage.removeItem('isAuthenticated');
    window.localStorage.removeItem('token');
  };

  return (
    <div>
      <Menu pointing secondary>
        <Menu.Item
          name='OrganChain'
          style={{ marginLeft: '50px', fontWeight: 'bold' }}
        />
        {!window.localStorage.getItem('isAuthenticated') ? (
          <Menu.Menu position='right' style={{ marginRight: '40px' }}>
            <Menu.Item as={Nav} to='/organ-donation/' name='home' />
            <Menu.Item
              as={Nav}
              to='/organ-donation/donor-login'
              name='Donor Login'
            />
            <Menu.Item
              as={Nav}
              to='/organ-donation/donor-signup'
              name='Donor Sign Up'
            />
            <Menu.Item
              as={Nav}
              to='/organ-donation/hospital-login'
              name='Hospital Login'
            />
          </Menu.Menu>
        ) : (
          <Menu.Menu position='right' style={{ marginRight: '40px' }}>
            <Menu.Item as={Nav} to='/Organ-donation/' name='home' />
            <Menu.Item
              as={Nav}
              to='/organ-donation/approve-donor'
              name='Approve Donor'
            />
            <Menu.Item
              as={Nav}
              to='/organ-donation/register-recipient'
              name='Register Recipient'
            />
            <Menu.Item
              as={Nav}
              to='/organ-donation/transplant-match'
              name='Transplant Match'
            />
            <Menu.Item
              as={Nav}
              to='/organ-donation/patient-record'
              name='Patient Record'
            />
            <Menu.Item as={Nav} to='/' name='Logout' onClick={logout} />
          </Menu.Menu>
        )}
      </Menu>
    </div>
  );
};
export default OrganHeader;
