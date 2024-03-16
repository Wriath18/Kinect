import SidebarItems from "../../components/SidebarItems";
import Dashboard from "./Dashboard";

const HomePage = () => {
  return (
    <div className="flex flex-row h-full">
      <SidebarItems activeClass="dashboard" />
      <Dashboard />
    </div>
  );
};

export default HomePage;
