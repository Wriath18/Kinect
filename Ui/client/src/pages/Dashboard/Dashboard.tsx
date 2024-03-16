import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import quotes from "./quotes";
// import CaloriesChart from "./CaloriesChart";
import { signOut } from "../../redux/user/userSlice";

let totalSteps = 0;
let totalCalories = 0;

const HeartRateChart = () => {
  const [steps, setSteps] = useState([{}]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await axios.get(
          "https://v1.nocodeapi.com/kinect/fit/nAvdQVuVGOsQYFll/aggregatesDatasets?dataTypeName=steps_count,calories_expended&timePeriod=7days&durationTime=daily"
        );
        const data = response.data;
        const { steps_count } = data;
        setSteps(steps_count);
      } catch (error: any) {
        console.error("error fetching user stats:", error);
      }
    };

    fetchSteps();
  }, []);

  useEffect(() => {
    const calculateSteps = () => {
        steps.map((step: any) => totalSteps += step.value)
    }

    calculateSteps();
  }, [])

  const data = steps.map((step: any) => {
    return { name: "", uv: step["value"] };
  });

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
        const response = await axios.get(
          "https://v1.nocodeapi.com/kinect/fit/nAvdQVuVGOsQYFll/aggregatesDatasets?dataTypeName=steps_count,calories_expended&timePeriod=7days&durationTime=daily"
        );
        const data = response.data;
        const { calories_expended } = data;
        setCalories(calories_expended);
      } catch (error: any) {
        console.error("error fetching user stats:", error);
      }
    };

    fetchCalories();
  }, []);

  const caloriesToPush = calories.map((calorie: any) =>
    caloriesBurned.push(calorie.value)
  );
  // caloriesToPush();
  // const caloriesBurned = [249, 341, 183, 142, 197, 104, 207];

  const today = new Date();
  const getPastDays = (days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const newDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const month = newDate.toLocaleString("default", { month: "long" });
      const day = newDate.getDate();
      totalCalories += caloriesBurned[i];
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

interface UserDetails {
  [key: string]: {
    username: string;
    profilePicture: string;
  };
}
const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const [quote, setQuote] = useState("hey");
  const [greeting, setGreeting] = useState("Good day");
  const [allContacts, setAllContacts] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({});

  useEffect(() => {
    const handleTimeUpdate = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 4 && hours < 12) {
        setGreeting("Good morning");
      } else if (hours >= 12 && hours < 18) {
        setGreeting("Good afternoon");
      } else if (hours >= 18 && hours < 21) {
        setGreeting("Good evening");
      } else {
        setGreeting("Good day");
      }
    };

    const selectRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    };

    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `/api/user/get-contacts/${currentUser._id}`
        );
        setAllContacts(response.data.contacts);
      } catch (error) {
        console.error("error fetching contacts:", error);
      }
    };

    handleTimeUpdate();
    selectRandomQuote();
    fetchContacts();
    setInterval(() => {
      handleTimeUpdate();
      selectRandomQuote();
    }, 60 * 60 * 1000);
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.get("/api/auth/sign-out");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDetails = async (contactId: string) => {
    try {
      const response = await axios.get(`/api/user/get-username/${contactId}`);
      const { username, profilePicture } = response.data;
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [contactId]: { username, profilePicture },
      }));
    } catch (error) {
      console.error("error fetching username:", error);
    }
  };

  useEffect(() => {
    allContacts.forEach((contactId) => {
      fetchUserDetails(contactId);
    });
  }, [allContacts]);

  return (
    <div className="flex-grow text-gray-800">
      <main className="p-6 sm:p-10 space-y-6">
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6">
            <h1 className="text-4xl font-semibold mb-2">
              {greeting},{" "}
              <span className="capitalize tracking-widest">
                {currentUser.username}!
              </span>
            </h1>
            <h2 className="text-gray-600 ml-0.5">{quote}</h2>
          </div>
          <div className="flex flex-wrap items-start justify-end -mb-3">
            <button
              onClick={handleSignOut}
              className="inline-flex px-5 py-3 text-purple-600 hover:text-purple-700 focus:text-purple-700 hover:bg-indigo-100 focus:bg-indigo-100 border border-purple-600 rounded-md mb-3"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
              <img src="/heart-rate.svg" alt="heart rate" />
            </div>
            <div>
              <span className="block text-2xl font-bold">99 BPM</span>
              <span className="block text-gray-500 capitalize">heart rate</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 rounded-full mr-6">
              <img src="/weight.png" alt="blood pressure" />
            </div>
            <div>
              <span className="block text-2xl font-bold">79.1 KG</span>
              <span className="block text-gray-500 capitalize">weight</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
              <img src="/oxygen-level.svg" alt="oxygen level" />
            </div>
            <div>
              <span className="block text-2xl font-bold">100%</span>
              <span className="block text-gray-500 capitalize">
                oxygen level {`(Yesterday)`}
              </span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 mr-6">
              <img src="/bmi.png" alt="thermometer temperature" />
            </div>
            <div>
              <span className="block text-2xl font-bold uppercase">
                26.5
              </span>
              <span className="block text-gray-500 capitalize">
                BMI
              </span>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
          <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow-2xl rounded-lg">
            <div className="px-6 py-5 font-semibold border-b border-gray-100">
              Recent Steps Count
            </div>
            <div className="p-4 flex-grow">
              <HeartRateChart />
            </div>
          </div>

          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 mr-6">
              <img src="/steps.svg" alt="steps walked" />
            </div>
            <div>
              <span className="block text-2xl font-bold">
                40880
              </span>
              <span className="block text-gray-500 capitalize">
                Steps walked this week
              </span>
            </div>
          </div>

          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
              <img src="/calorie.png" alt="stress" />
            </div>
            <div>
              <span className="block text-2xl font-bold">
                11615
              </span>
              <span className="block text-gray-500 capitalize">
                Calories burned this week
              </span>
            </div>
          </div>
          <div className="row-span-3 bg-white shadow-2xl rounded-lg">
            <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
              <span>Contacts</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
              <ul className="p-6 space-y-6">
                {allContacts.length < 1 ? (
                  <div className="text-center text-2xl italic">
                    No contacts available
                  </div>
                ) : (
                  <>
                    {allContacts.map((contactId) => (
                      <li key={contactId} className="flex items-center">
                        <div className="h-12 w-12 mr-3">
                          <img
                            src={userDetails[contactId]?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"}
                            alt="Profile Picture"
                          />
                        </div>
                        <span className="ml-auto capitalize text-sm tracking-widest font-[500]">
                          {`${userDetails[contactId]?.username} (+91 7827545536)` || "Loading..."}
                        </span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="flex flex-col row-span-3 bg-white shadow-2xl rounded-lg">
            <div className="px-6 py-5 font-semibold border-b border-gray-100">
              <p className="capitalize">calories burned</p>
            </div>
            <div className="p-4 flex-grow">
              <CaloriesChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
