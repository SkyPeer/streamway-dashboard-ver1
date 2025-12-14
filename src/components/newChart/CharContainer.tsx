import * as React from 'react';
import { Chance } from 'chance';
import {useEffect} from "react";

import Box from '@mui/material/Box';
import useId from '@mui/utils/useId';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';

const chance = new Chance(42);

// const data = Array.from({ length: 100 }, () => ({
//   x: chance.floating({ min: -25, max: 25 }),
//   y: chance.floating({ min: -25, max: 25 }),
// })).map((d, index) => ({ ...d, id: index }));

const minDistance = 10;

export default function LimitOverflow() {
  const [isLimited, setIsLimited] = React.useState(false);
  const [xLimits, setXLimites] = React.useState<number[]>([-20, 20]);
  const [data, setData] = React.useState<any[]>([]);
  const [xAxis, setXAxis] = React.useState<number[]>([]);

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const getTempReadings = async () => {
    const res = await fetch('http://localhost:8200/meteo/readings');
    const response = await res.json();



    const xLegend = response.filter(item => item.cityId === 1).map(item => item.timeStamp)
    const result = response.filter(item => item.cityId === 1).map(item => ({y: item.max, x: item.timeStamp, id: item.id}));
    setData(result);
    // { id: 0, x: 'Category A', y: 7 },

    console.log(xLegend);

    setXAxis(xLegend);


  }

  useEffect(() => {
    getTempReadings()
  }, []);


  const handleChange = (
      event: Event,
      newValue: number | number[],
      activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setXLimites([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setXLimites([clamped - minDistance, clamped]);
      }
    } else {
      setXLimites(newValue as number[]);
    }
  };
  //
  // const data = [
  //   { id: 0, x: 'Category A', y: 7 },
  //   { id: 1, x: 'Category B', y: 25 },
  //   { id: 2, x: 'Category C', y: 15 },
  //   { id: 3, x: 'Category D', y: 30 },
  // ];

  return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <FormControlLabel
            checked={isLimited}
            control={
              <Checkbox onChange={(event) => setIsLimited(event.target.checked)} />
            }
            label="Clip the plot"
            labelPlacement="end"
        />
        <ChartContainer
            xAxis={[
              {
                data: xAxis,
                scaleType: 'point',
                id: 'x-axis-id',
                height: 45,
              },
            ]}
            series={[
              {
                type: 'scatter',
                data,
                markerSize: 10
              },
              {
                type: 'line',
                data: [10, 13, 12, 5, -6, -3, 4, 20, 18, 17, 12, 11],
                showMark: true,
              },
            ]}
            height={300}
        >
          <ChartsGrid vertical horizontal />
          <g clipPath={`url(#${clipPathId})`}>
            <ScatterPlot />
            <LinePlot />
          </g>
          <ChartsXAxis />
          <ChartsYAxis />
          <MarkPlot />
          {isLimited && <ChartsClipPath id={clipPathId} />}
        </ChartContainer>

        <Slider
            value={xLimits}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={-40}
            max={40}
        />
      </Box>
  );
}