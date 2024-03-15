import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";

import { signOut } from "../../redux/user/userSlice";
import HeartRateChart from "./HeartRateChart";
import CaloriesChart from "./CaloriesChart";
import quotes from "./quotes";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const [quote, setQuote] = useState("hey");
  const [greeting, setGreeting] = useState("Good day");
  const [steps, setSteps] = useState([{}]);
  const [calories, setCalories] = useState([]);


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

    const fetchStats = async () => {
      try {
        const response = await axios.get('https://v1.nocodeapi.com/wriath/fit/WrAfDcDMAPpXDHco/aggregatesDatasets?dataTypeName=steps_count,calories_expended&timePeriod=7days');
        const data = response.data;
        const { steps_count, calories_expended } = data;
        console.log(steps_count);
        console.log(calories_expended);
        setSteps(steps_count);
        setCalories(calories_expended);
        console.log(steps);
        console.log(calories);
      } catch (error: any) {
        console.error("error fetching user stats:", error);
      }
    };

    handleTimeUpdate();
    selectRandomQuote();
    fetchStats();
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
              <span className="block text-2xl font-bold">89 BPM</span>
              <span className="block text-gray-500 capitalize">heart rate</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 rounded-full mr-6">
              <img src="/weight.png" alt="blood pressure" />
            </div>
            <div>
              <span className="block text-2xl font-bold">79.1 KG</span>
              <span className="block text-gray-500 capitalize">
                weight
              </span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
              <img src="/oxygen-level.svg" alt="oxygen level" />
            </div>
            <div>
              <span className="block text-2xl font-bold">95%</span>
              <span className="block text-gray-500 capitalize">
                oxygen level
              </span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 mr-6">
              <img src="/thermometer.png" alt="thermometer temperature" />
            </div>
            <div>
              <span className="block text-2xl font-bold uppercase">
                98 &deg; f
              </span>
              <span className="block text-gray-500 capitalize">
                temperature
              </span>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
          <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow-2xl rounded-lg">
            <div className="px-6 py-5 font-semibold border-b border-gray-100">
              Recent Heart Rates
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
              <span className="block text-2xl font-bold">7869</span>
              <span className="block text-gray-500 capitalize">Steps</span>
            </div>
          </div>

          <div className="flex items-center p-8 bg-white shadow-xl rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
              <img src="/calorie.png" alt="stress" />
            </div>
            <div>
              <span className="block text-2xl font-bold">280</span>
              <span className="block text-gray-500 capitalize">
                calories burned today
              </span>
            </div>
          </div>
          <div className="row-span-3 bg-white shadow-2xl rounded-lg">
            <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
              <span>Contacts</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
              <ul className="p-6 space-y-6">
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Annette Watson profile picture"
                    />
                  </div>
                  <span className="text-gray-600">United States</span>
                  <span className="ml-auto font-semibold">9.3</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Calvin Steward profile picture"
                    />
                  </div>
                  <span className="text-gray-600">Spain</span>
                  <span className="ml-auto font-semibold">8.9</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Ralph Richards profile picture"
                    />
                  </div>
                  <span className="text-gray-600">United Kingdom</span>
                  <span className="ml-auto font-semibold">8.7</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Bernard Murphy profile picture"
                    />
                  </div>
                  <span className="text-gray-600">Malaysia</span>
                  <span className="ml-auto font-semibold">8.2</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Arlene Robertson profile picture"
                    />
                  </div>
                  <span className="text-gray-600">Russia</span>
                  <span className="ml-auto font-semibold">8.2</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Jane Lane profile picture"
                    />
                  </div>
                  <span className="text-gray-600">Canada</span>
                  <span className="ml-auto font-semibold">8.1</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Pat Mckinney profile picture"
                    />
                  </div>
                  <span className="text-gray-600">India</span>
                  <span className="ml-auto font-semibold">7.9</span>
                </li>
                <li className="flex items-center">
                  <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                      alt="Norman Walters profile picture"
                    />
                  </div>
                  <span className="text-gray-600">Australia</span>
                  <span className="ml-auto font-semibold">7.7</span>
                </li>
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
