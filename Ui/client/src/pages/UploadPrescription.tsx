import SidebarItems from "../components/SidebarItems";
import PostPrescription from "../components/PostPrescription";

const UploadPrescription = () => {
  return (
    <div className="flex flex-row h-screen">
      <SidebarItems activeClass="upload" />
      <div className="mx-auto">
        <PostPrescription />
      </div>
    </div>
  );
};

export default UploadPrescription;
