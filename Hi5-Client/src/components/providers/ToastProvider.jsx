import PropTypes from "prop-types";
import { Toaster, toast as t } from "react-hot-toast";

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PostCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-center text-gray-900 text-sm dark:text-gray-100">
          Post Created Successfully!
        </p>
      </div>
    </div>
  ));
};


export const ReelCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-center text-gray-900 text-sm dark:text-gray-100">
          Reel Created Successfully!
        </p>
      </div>
    </div>
  ));
};
