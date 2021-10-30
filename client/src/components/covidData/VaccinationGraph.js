import React, { Fragment, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

// const data = {
//   datasets: [
//     {
//       label: '# of dose 1',
//       data: [12, 19, 3, 5, 2, 3],
//       fill: false,
//       backgroundColor: 'rgb(0,198,193)',
//       borderColor: 'rgba(0,198,193,0.4)',
//     },
//     {
//       label: '# of dose 2',
//       data: [3, 5, 15, 2, 19, 6],
//       fill: false,
//       backgroundColor: 'rgb(161,209,126)',
//       borderColor: 'rgba(161,209,126,0.4)',
//     },
//   ],
// };

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const VaccinationGraph = (props) => {
  const { dataset1, dataset2 } = props;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [labels, setLabels] = useState([]);
  const [boolVal, setBoolVal] = useState(false);

  useEffect(() => {
    const findDateWiseData = (dataSet, i) => {
      console.log(dataSet);
      const keys = Object.keys(dataSet);
      let arr = [];
      keys.forEach((d) => {
        arr.push(dataSet[d]);
      });
      if (i === 1) {
        setData1(arr);
      } else {
        setData2(arr);
      }
    };

    if (
      !boolVal &&
      Object.keys(dataset1).length !== 0 &&
      Object.keys(dataset2).length !== 0
    ) {
      setLabels(Object.keys(dataset1));
      findDateWiseData(dataset1, 1);
      findDateWiseData(dataset2, 2);
      setBoolVal(true);
    }
  }, [boolVal, dataset1, dataset2]);

  // console.log(data1);
  // console.log(data2);

  const data = {
    labels: labels,
    datasets: [
      {
        label: '# of dose 1',
        data: data1,
        fill: false,
        backgroundColor: 'rgb(0,198,193)',
        borderColor: 'rgba(0,198,193,0.4)',
      },
      {
        label: '# of dose 2',
        data: data2,
        fill: false,
        backgroundColor: 'rgb(161,209,126)',
        borderColor: 'rgba(161,209,126,0.4)',
      },
    ],
  };

  return (
    <Fragment>
      <Line data={data} options={options} />
    </Fragment>
  );
};

export default VaccinationGraph;
