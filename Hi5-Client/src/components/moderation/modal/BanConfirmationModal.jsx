import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BanConfirmationModal = ({
    isOpen,
    closeModal,
    confirmBan,
    isBanning,
}) => {

    const [banDate, setBanDate] = useState(new Date());
    const [yearsToAdd, setYearsToAdd] = useState(0);
    const [monthsToAdd, setMonthsToAdd] = useState(0);
    const [daysToAdd, setDaysToAdd] = useState(0);

    const updateBanDate = () => {
        let newBanDate = new Date(banDate);
        newBanDate.setFullYear(newBanDate.getFullYear() + yearsToAdd);
        newBanDate.setMonth(newBanDate.getMonth() + monthsToAdd);
        newBanDate.setDate(newBanDate.getDate() + daysToAdd);
        setBanDate(newBanDate);
    };

    const handleInputChange = (e, type) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            value = 0;
        }
        if (type === "year") setYearsToAdd(value);
        if (type === "month") setMonthsToAdd(value);
        if (type === "day") setDaysToAdd(value);
    };

    const handleTimeChange = (date) => {
        setBanDate(date);
    };

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, closeModal]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const clearAll = () => {
        setYearsToAdd(0);
        setMonthsToAdd(0);
        setDaysToAdd(0);
    }

    return (
        <>
            {isOpen && (
                <div
                    className={`z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${isBanning ? "pointer-events-none" : ""
                        }`}
                    onClick={handleOutsideClick}
                >
                    <div
                        className={`bg-white dark:bg-black border border-gray-500 shadow-lg rounded-lg  w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 sm:p-8 transition-transform duration-300 transform ${isBanning ? "scale-95 pointer-events-none" : "scale-100"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 text-xl">
                                Confirm Ban
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 dark:text-gray-200"
                                disabled={isBanning}
                            >
                                <CloseRoundedIcon
                                    sx={{
                                        fontSize: { xs: 25, sm: 28, md: 30 },
                                    }}
                                />
                            </button>
                        </div>

                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            Are you sure you want to ban this account?
                        </p>
                        <div className="mb-6">
                            <label htmlFor="banDate" className="block mb-2 text-gray-700 dark:text-gray-300">
                                Ban Date
                            </label>
                            <DatePicker
                                selected={banDate}
                                onChange={handleTimeChange}
                                dateFormat="yyyy-MM-dd"
                                className="dark:bg-gray-800 px-4 py-2 border border-gray-500 rounded-lg outline-none w-full dark:text-white"
                                disabled={isBanning}
                                placeholderText="Select a date"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-gray-700 dark:text-gray-300">Add Time</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center w-20">
                                    <label className="text-gray-700 dark:text-gray-300">Years</label>
                                    <input
                                        type="number"
                                        value={yearsToAdd}
                                        onChange={(e) => handleInputChange(e, "year")}
                                        className="dark:bg-gray-800 px-4 py-2 border border-gray-500 rounded-lg outline-none w-full dark:text-white"
                                        disabled={isBanning}
                                    />
                                </div>
                                <div className="flex flex-col items-center w-20">
                                    <label className="text-gray-700 dark:text-gray-300">Months</label>
                                    <input
                                        type="number"
                                        value={monthsToAdd}
                                        onChange={(e) => handleInputChange(e, "month")}
                                        className="dark:bg-gray-800 px-4 py-2 border border-gray-500 rounded-lg outline-none w-full dark:text-white"
                                        disabled={isBanning}
                                    />
                                </div>
                                <div className="flex flex-col items-center w-20">
                                    <label className="text-gray-700 dark:text-gray-300">Days</label>
                                    <input
                                        type="number"
                                        value={daysToAdd}
                                        onChange={(e) => handleInputChange(e, "day")}
                                        className="dark:bg-gray-800 px-4 py-2 border border-gray-500 rounded-lg outline-none w-full dark:text-white"
                                        disabled={isBanning}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={updateBanDate}
                                    className={`bg-yellow-500 dark:bg-yellow-600 ${isBanning ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600 dark:hover:bg-yellow-700"} px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                                    disabled={isBanning}
                                >
                                    Add Time
                                </button>
                                <button
                                    onClick={clearAll}
                                    className={`bg-gray-300 dark:bg-gray-600 ${isBanning ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400 dark:hover:bg-gray-500"} px-4 py-2 rounded-lg text-black dark:text-white transition-all duration-200 ease-in-out`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className={`bg-gray-300 dark:bg-gray-600 ${isBanning
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-400 dark:hover:bg-gray-500"
                                    } px-4 py-2 rounded-lg text-black dark:text-white transition-all duration-200 ease-in-out`}
                                disabled={isBanning}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    confirmBan(banDate);
                                }}
                                className={`bg-yellow-500 dark:bg-yellow-600 ${isBanning
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-yellow-600 dark:hover:bg-yellow-700"
                                    } px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out`}
                                disabled={isBanning}
                            >
                                Ban
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

BanConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    confirmBan: PropTypes.func.isRequired,
    isBanning: PropTypes.bool.isRequired,
};

export default BanConfirmationModal;
