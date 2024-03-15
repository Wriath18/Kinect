const LoginImage = () => {
  return (
    <div className="relative">
      <img
        src="/healthcare.jpg"
        alt="Image"
        className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
      />

      <div className="absolute hidden bottom-10 right-6 left-6 p-6 bg-white bg-opacity-40 backdrop-blur-sm rounded drop-shadow-lg md:block italic">
        <span className="text-black text-xl">
          Tech that cares, for you and the ones you care about.
        </span>
      </div>
    </div>
  );
};

export default LoginImage;
