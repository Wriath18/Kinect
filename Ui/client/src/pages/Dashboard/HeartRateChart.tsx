import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const HeartRateChart = () => {
  const [steps, setSteps] = useState([{}]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await axios.get('https://v1.nocodeapi.com/wriath/fit/WrAfDcDMAPpXDHco/aggregatesDatasets?dataTypeName=steps_count,calories_expended&timePeriod=7days');
        const data = response.data;
        const { steps_count } = data;
        setSteps(steps_count);
      } catch (error: any) {
        console.error("error fetching user stats:", error);
      }
    };

    fetchSteps();
  }, []);

  const data = steps.map((step: any) => (
    { name: "", uv: step["value"] }
  ));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={200}
        height={200}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;
