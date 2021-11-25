import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from './url';
import { Card, Segment, Header, Divider, Grid } from 'semantic-ui-react';
import OrganHeader from './OrganHeader';

const HospitalList = (props) => {
  const [hospitalList, setHospitalList] = useState([]);
  const [boolVal, setboolVal] = useState(false);
  const city = props.match.params.city;

  useEffect(() => {
    if (!boolVal) {
      var hospitals = [];
      axios
        .get(`${SERVER_URL}/api/hospitals/${city}`)
        .then((res) => {
          // for (let i = 0; i < res.data.length; i++) {
          //   const hospital = {
          //     address: `Address : ${res.data[i].address}`,
          //     city: res.data[i].city,
          //     name: res.data[i].username,
          //     contact: `Contact : ${res.data[i].contact}`,
          //     img: `../../images/${res.data[i].img}`,
          //   };
          //   hospitals.push(hospital);
          // }
          res.data.forEach((data) => {
            const hospital = {
              address: `Address : ${data.address}`,
              city: data.city,
              name: data.username,
              contact: `Contact : ${data.contact}`,
              img: `../../images/${data.img}`,
            };
            hospitals.push(hospital);
          });
          setHospitalList(hospitals);
          setboolVal(true);
        })
        .catch((err) => {
          console.log('Error:' + err);
          setboolVal(true);
        });
    }
  }, [boolVal, city]);

  const renderHospitals = () => {
    var hospitals = hospitalList.map((hospital) => {
      return {
        image: hospital.img,
        header: hospital.name,
        meta: hospital.contact,
        description: hospital.address,
      };
    });
    return <Card.Group items={hospitals} centered />;
  };

  return (
    <div>
      <OrganHeader />
      <Grid centered columns={2} style={{ marginTop: '20px' }}>
        <Grid.Column width={12}>
          <Segment>
            <Header as='h3' color='grey' style={{ textAlign: 'center' }}>
              Please visit any one hospital from the given list, to get yourself
              approved!
            </Header>
            <Divider />
            {renderHospitals()}
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default HospitalList;
