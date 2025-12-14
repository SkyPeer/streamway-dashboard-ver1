import { Chart } from 'react-chartjs-2';
import React, { useRef, Fragment, useState, useEffect } from 'react';
import {
  Title,
  Legend,
  Tooltip,
  BarElement,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  Chart as ChartJS,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    filler: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};


export const MixedChart = (props: any) => {
  const defaultDataSet = {
    datasets: [
      {
        type: 'line',
        label: 'Predict',
        data: [],
      },
      {
        type: 'scatter',
        label: 'Data',
        data: [],
        backgroundColor: 'rgb(239, 68, 68)',
      },
    ],
    labels: []
  };
  const [data, setData] = useState(defaultDataSet);
  const [learningData, setLearningData] = useState(defaultDataSet);
  const chartRef = useRef();

  const getTempReadings = async () => {
    // const res = await fetch('http://localhost:8200/meteo/readings');
    // const readings = await res.json();

    // const ttt = await fetch('http://localhost:3000/forecast/predict');
    // const apiResponse = await ttt.json();

    const meteoData = await fetch('http://localhost:3000/forecast/data');
    const apiResponse = await meteoData.json();

    const modelData = await fetch('http://localhost:3000/forecast/model');
    const modelApiResponse = await modelData.json();



    const getDateWoTime = (timeStamp: string) => {
      const dateObject = new Date(timeStamp);
      return dateObject.toISOString().split('T')[0];
    };

    const dataSet = {
      datasets: [
        {
          type: 'line',
          label: 'Training',
          data: apiResponse.trainings,
          borderColor: 'rgba(59,130,246,0.32)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
        },
        {
          type: 'line',
          label: 'Predict',
          data: apiResponse.predicts,
          borderColor: 'rgb(159,59,246)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
        },
        {
          type: 'scatter',
          label: 'Data',
          data: apiResponse.temps,
          backgroundColor: 'rgb(239, 68, 68)',
        },
      ],
      labels: apiResponse.labels,
    };

    const learningDataSet = {
      datasets: [
        {
          type: 'line',
          label: 'Predict',
          data: modelApiResponse.map(item => item.loss),
          borderColor: 'rgb(159,59,246)',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
        },
      ],
      labels: modelApiResponse.map((item) => item.epoch),
    };


    console.log('data', data);
    setData({ ...dataSet });

    setLearningData({ ...learningDataSet });
    //chartRef.current.update()
  }


  useEffect(() => {
    console.log('mounted')
    getTempReadings();
  }, []);

  return (
    <Fragment>
      <div>
        <button
          onClick={() => {
            //setData(defaultDataSet);
            getTempReadings();
          }}
        >
          Train
        </button>
      </div>
      <Fragment>
        <Chart ref={chartRef} type="bar" data={data} options={options} />
        <Chart ref={chartRef} type="bar" data={learningData} options={options} />
      </Fragment>
    </Fragment>
  );
}



