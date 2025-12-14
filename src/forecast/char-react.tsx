import { Chance } from 'chance';
import { Line } from 'react-chartjs-2';
import React, {Fragment, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const chance = new Chance(42);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

// https://codesandbox.io/p/sandbox/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/chart/events?embed=1

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//
// export const data = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: 'Dataset 2',
//       data: labels.map(() => chance.floating({ min: 0, max: 1000 })),
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

export const ForeCastTemp = () => {
  const [isLimited, setIsLimited] = React.useState(false);
  const [xLimits, setXLimites] = React.useState<number[]>([-20, 20]);
  const [data, setData] = React.useState<any>(null);
  const [xAxis, setXAxis] = React.useState<number[]>([]);
  const [legends, setLegends] = React.useState<number[]>([]);


  const getTempReadings = async () => {
    const res = await fetch('http://localhost:8200/meteo/readings');
    const response = await res.json();

    const xLegend = response.filter(item => item.cityId === 1).map(item => item.timeStamp)
    const result = response.filter(item => item.cityId === 1).map(item => ({
      y: item.max,
      x: item.timeStamp,
      id: item.id
    }));
    // setData(result);
    // { id: 0, x: 'Category A', y: 7 },


    const source = {
      labels: xLegend,
      datasets: [
        {
          fill: true,
          label: 'Dataset 2',
          data: response.filter(item => item.cityId === 1).map(item => item.max),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };

    setData(source);

    console.log(source);
  }

  useEffect(() => {
    getTempReadings();
  }, [])


  return (
    <Fragment>
      {data && <Line options={options} data={data} />}

    </Fragment>
  )

}
