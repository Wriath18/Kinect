import SidebarItems from "../components/SidebarItems";

const About = () => {
  return (
    <div className="flex flex-row h-screen">
      <SidebarItems activeClass="about" />
      <div className="about-content px-10 py-5">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">About</h1>
        <p className="mb-4">
          We are dedicated to improving the lives of elderly individuals 
          and their caregivers. We understand the challenges of managing 
          medication schedules, especially remembering medications, dosages,
          and frequencies. That's why we've developed a user-friendly platform to 
          streamline medication management and promote overall well-being for seniors.
        </p>
      
        <p className="mb-8">
          Our platform acts as a personalized assistant, answering 
          any questions regarding medications and their uses. 
          No more confusion about what a particular drug is for!
        </p>
        
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Contact Us</h2>
        <ul>
          <li>
            <span><b>Phone:</b> </span>  
            <span> (+91) 8130062362 </span>  
          </li>
          <li>
            <span><b>Email:</b> </span>  
            <span><a href="mailto:youremail@example.com">helpdesk@kinect.com</a></span>  
          </li>
        </ul>
         <div className="my-8 p-4 bg-slate-100 rounded-lg shadow-md flex flex-row space-x-4">
          <div className="w-1/2">
            <h3 className="text-lg font-medium text-slate-700">Assistance</h3>
            <p className="mb-4">Our platform acts as a personalized assistant, answering 
        any questions regarding medications and 
        their uses. 
        No more confusion about what a particular drug is for!</p>
          </div>
          <div className="w-1/2">
            <h3 className="text-lg font-medium text-slate-700">Timely Medication</h3>
            <p className="mb-4">Gone are the days of missed doses. Our system generates
        personalized reminders to ensure medications are taken on 
        time and at the right frequency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
