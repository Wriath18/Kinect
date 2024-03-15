import PrescriptionTable from "../components/PrescriptionTable";
import SidebarItems from "../components/SidebarItems";

const Prescription = () => {
  return (
    <div className="flex flex-row h-screen">
      <SidebarItems activeClass="prescription" />
      <PrescriptionTable />
    </div>
  );
};

export default Prescription;
