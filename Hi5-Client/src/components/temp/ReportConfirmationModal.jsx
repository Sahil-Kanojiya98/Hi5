import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const reportReasonsEnum = {
  HARASSMENT_BULLYING: "Harassment or Bullying",
  HATE_SPEECH: "Hate Speech",
  SPAM: "Spam",
  NUDITY: "Nudity or Sexual Content",
  VIOLENCE_THREATS: "Violence or Threats",
  SELF_HARM_SUICIDE: "Self-Harm or Suicide",
  MISINFORMATION: "Misinformation",
  IMPERSONATION: "Impersonation",
  INTELLECTUAL_PROPERTY: "Intellectual Property Violations",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  SCAMS_FRAUD: "Scams or Fraud",
  ILLEGAL_ACTIVITIES: "Illegal Activities",
};

const ReportConfirmationModal = ({
  isOpen,
  closeModal,
  report,
  isReporting,
  type,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (selectedReason) {
      report(selectedReason);
      closeModal();
    } else {
      setError("Please select a reason before submitting.");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${isReporting ? "opacity-50 pointer-events-none" : ""
            }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`bg-white dark:bg-gray-900 shadow-lg p-4 sm:p-6 md:p-8 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md transition-transform duration-300 transform ${isOpen ? "scale-100" : "scale-95"
              } ${isReporting ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between items-center mb-4 text-xl">
              <h3 className="font-semibold text-red-600 dark:text-red-400">
                Confirm Report
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-100 dark:text-gray-300"
                disabled={isReporting}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                />
              </button>
            </div>
            {type === "POST" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this post:
              </p>
            )}
            {type === "REEL" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this reel:
              </p>
            )}
            {type === "COMMENT" && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this comment:
              </p>
            )}
            <div className="mb-4 px-4 py-3 border-2 rounded-lg max-h-60 overflow-y-auto hide-scrollbar">
              {Object.keys(reportReasonsEnum).map((key) => (
                <div key={key} className="flex items-center mb-3">
                  <input
                    type="radio"
                    id={key}
                    name="reportReason"
                    value={key}
                    checked={selectedReason === key}
                    onChange={() => {
                      setError(null);
                      setSelectedReason(key);
                    }}
                    className="mr-2"
                    disabled={isReporting}
                  />
                  <label className="text-gray-700 dark:text-gray-300">
                    {reportReasonsEnum[key]}{" "}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3 text-red-700 dark:text-red-400 text-xs">
              {error}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-black dark:text-gray-200 transition-all duration-200 ease-in-out`}
                disabled={isReporting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                disabled={isReporting}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ReportConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  report: PropTypes.func.isRequired,
  isReporting: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReportConfirmationModal;
