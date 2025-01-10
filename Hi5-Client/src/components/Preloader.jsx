import logo from "../assets/images/logo/Hi5.svg";

const Preloader = () => {
  console.log("Preloader");

  return (
    <div className="flex w-screen h-screen p-4 mx-auto bg-black">
      <div className="flex flex-col items-center justify-center flex-1">
        <img
          src={logo}
          alt="Hi5"
          className="w-1/6 sm:w-28 md:w-32 lg:w-36 xl:w-40"
        />
      </div>
    </div>
  );
};

export default Preloader;
