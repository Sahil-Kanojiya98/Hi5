import MainLayout from "../components/layout/MainLayout";
import Reels from "../components/reel/Reels";

const ReelsPage = () => {
  return (
    <MainLayout>
      <div className="flex justify-center items-center gap-5 md:pl-[70px] lg:pl-[260px]">
        <div className="flex flex-col justify-center items-center gap-10 bg-white dark:bg-black mr-auto w-full max-w-lg">
          <Reels feedType="Random" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ReelsPage;
