const RightPanelSkeleton = () => {
  return (
    <div className="flex items-center justify-between my-1">
      <div className="flex gap-2 items-center">
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-2.5 w-24 rounded"></div>
          <div className="skeleton h-2 w-20 rounded"></div>
        </div>
      </div>
      <div className="skeleton h-7 w-28 rounded-full"></div>
    </div>
  );
};

export default RightPanelSkeleton;