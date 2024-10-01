import Echohub from "./logo/Echohub";

function Preloader() {
  return (
    <div className="max-w-screen-xl flex h-screen mx-auto p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Echohub classNames={"text-5xl"} />
      </div>
    </div>
  );
}

export default Preloader;