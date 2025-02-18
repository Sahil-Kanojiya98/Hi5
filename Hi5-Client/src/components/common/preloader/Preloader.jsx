import logo from "../../../assets/images/logo/Hi5.svg";

const Preloader = () => {
  console.log("Preloader");

  return (
    <div className="flex bg-black mx-auto p-4 w-screen h-screen">
      <div className="flex flex-col flex-1 justify-center items-center">
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
