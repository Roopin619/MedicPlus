import React, { Fragment } from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['1', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: '# of dose 1',
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: 'rgb(0,198,193)',
      borderColor: 'rgba(0,198,193,0.4)',
    },
    {
      label: '# of dose 2',
      data: [3, 5, 15, 2, 19, 6],
      fill: false,
      backgroundColor: 'rgb(161,209,126)',
      borderColor: 'rgba(161,209,126,0.4)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const VaccinationGraph = () => (
  <Fragment>
    <Line data={data} options={options} />
  </Fragment>
);

export default VaccinationGraph;
