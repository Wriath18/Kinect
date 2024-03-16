import { useState, useCallback, useEffect } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";

let caloriesBurned: any = [];

const CaloriesChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [calories, setCalories] = useState([]);

  const handleClick = useCallback(
    (entry: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const response = await axios.get('https://v1.nocodeapi.com/kinect/fit/nAvdQVuVGOsQYFll/aggregatesDatasets?dataTypeName=steps_count,calories_expended&timePeriod=7days');
        const data = response.data;
        const { calories_expended } = data;
        setCalories(calories_expended);
      } catch (error: any) {
        console.error("error fetching user stats:", error);
      }
    };

    fetchCalories();
  }, []);

  const caloriesToPush = calories.map((calorie: any) => (
    caloriesBurned.push(calorie.value)
  ));
  // caloriesToPush();
  // const caloriesBurned = [249, 341, 183, 142, 197, 104, 207];

  const today = new Date();
  const getPastDays = (days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const newDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const month = newDate.toLocaleString("default", { month: "long" });
      const day = newDate.getDate();
      dates.push({
        name: `${month} ${day}`,
        uv: caloriesBurned[i],
      });
    }
    return dates;
  };

  const data = getPastDays(7);
  const activeItem = data[activeIndex];

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <Bar dataKey="uv" onClick={handleClick}>
            {data.map((entry, index: number) => (
              <Cell
                cursor="pointer"
                fill={index === activeIndex ? "#82ca9d" : "#8884d8"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-[0.8rem] mt-2 italic">
        Calories burned on {activeItem.name}:
        <span className="font-semibold"> {activeItem.uv}</span>
      </p>
    </>
  );
};

export default CaloriesChart;
