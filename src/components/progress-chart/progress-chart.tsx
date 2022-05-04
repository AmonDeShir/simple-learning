import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchData } from '../../api/fetchData';
import { useAppDispatch } from '../../redux/store';
import { handleLoadingErrors, loadData } from '../../utils/load-data/load-data';
import { useRect } from '../../utils/use-rect/use-rect';
import { Card } from '../card/card';
import { Loading, RegisterLoading } from '../loading/loading';

export type ChartData = {
  learning: number, 
  relearning: number,  
  graduated: number
}

export const ProgressChart = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useRect(ref);
  const matchesPC = useMediaQuery('(min-width:1024px)');
  
  const [ data, setData ] = useState<ChartData[]>([])
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const abortController = new AbortController();
    
    fetchData<ChartData[]>(() => axios.get('/api/v1/sets/progress', { signal: abortController.signal }), dispatch)
      .then((res) => loadData(res, setData, setLoading, undefined, true))
      .catch((e) => handleLoadingErrors(e, setLoading));

    return () => abortController.abort();
  }, [dispatch]);

  return (
    <Card ref={ref} title="Learning Progress" size="xl">
      <Loading timeout={20000} noBackground {...loading}>
        <BarChart
          width={width}
          height={matchesPC ? 430 : 250}
          data={data.map((data, id) => ({...data, day: id + 1}))}
          margin={{
            bottom: 25,
            top: 25,
            right: 35,
            left: -25,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="graduated" stackId="a" fill="#4a9e49" />
          <Bar dataKey="relearning" stackId="a" fill="#c74017" />
          <Bar dataKey="learning" stackId="a" fill="#9dd99d" />
        </BarChart>
      </Loading>
  </Card>
  );
}