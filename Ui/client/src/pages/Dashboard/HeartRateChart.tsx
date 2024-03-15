import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "",
    uv: 138,
  },
  {
    name: "",
    uv: 118,
  },
  {
    name: "",
    uv: 97,
  },
  {
    name: "",
    uv: 105,
  },
  {
    name: "",
    uv: 117,
  },
  {
    name: "",
    uv: 89,
  },
  {
    name: "",
    uv: 147,
  },
];

const HeartRateChart = () => {
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
