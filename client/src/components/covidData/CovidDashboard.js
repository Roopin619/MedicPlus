// import React, { useEffect, useState } from 'react';
// import VaccinationGraph from './VaccinationGraph';
// import '../../styles/CovidDashboard.css';

// const CovidDashboard = () => {
//   const [dataset1, setDataset1] = useState({});
//   const [dataset2, setDataset2] = useState({});

//   useEffect(() => {
//     fetch('https://data.covid19india.org/v4/min/timeseries.min.json')
//       .then((response) => response.json())
//       .then((data) => {
//         let obj = {};
//         let obj2 = {};
//         const keys = Object.keys(data);
//         keys.map((d) => {
//           // arr.push({
//           //   v1: data[d].dates[moment(new Date()).format('YYYY-MM-DD')]
//           //     ? data[d].dates[moment(new Date()).format('YYYY-MM-DD')].total
//           //         .vaccinated1
//           //     : 0,
//           //   v2: data[d].dates[moment(new Date()).format('YYYY-MM-DD')]
//           //     ? data[d].dates[moment(new Date()).format('YYYY-MM-DD')].total
//           //         .vaccinated2
//           //     : 0,
//           // });
//           const dates = Object.keys(data[d].dates);

//           dates.forEach((i) => {
//             if (
//               data[d].dates[i]?.delta?.vaccinated1 &&
//               data[d].dates[i]?.delta?.vaccinated2
//             ) {
//               obj[i] = obj[i]
//                 ? obj[i] + data[d].dates[i].delta.vaccinated1
//                 : data[d].dates[i].delta.vaccinated1;
//               obj2[i] = obj2[i]
//                 ? obj2[i] + data[d].dates[i].delta.vaccinated2
//                 : data[d].dates[i].delta.vaccinated2;
//             }
//           });
//         });
//         setDataset1(obj);
//         setDataset2(obj2);
//       });
//   }, []);

//   // console.log(dataset1);
//   // console.log(dataset2);

//   return (
//     <div className='mainContainer'>
//       <div className='covid-content'>
//         <h1 className='covid-pageTitle'> Covid Visualisation</h1>
//       </div>
//       <div className='covid-vaccinationDiv'>
//         <VaccinationGraph dataset1={dataset1} dataset2={dataset2} />
//       </div>
//     </div>
//   );
// };

// export default CovidDashboard;
