import RoutesConfig from "./Routes";

const App = () => {
  console.log("App Mounted");

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 font-roboto text-black dark:text-white text-base">
        <RoutesConfig />
      </div>
    </>
  );
};

export default App;
