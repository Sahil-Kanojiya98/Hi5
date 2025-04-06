import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios.config";
import ReportDetail from "./ReportDetail";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteAllReports } from "../../services/api";

const ReportDetailsModel = ({
    isOpen,
    onClose,
    type,
    relevantId,
    removeEntity,
}) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    console.log(type, relevantId);

    const [reportDetails, setReportDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                const response = await axiosInstance.get("/moderate/report-summary", {
                    params: {
                        reportType: type,
                        relevantId,
                    },
                });
                console.log(response.data);
                setReportDetails(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportDetail();
    }, [relevantId, type])


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteAllReports(relevantId, type);
            console.log("Reports deleted: " + relevantId);
        } catch (error) {
            console.error("Error deleting reports: ", error);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
            onClose();
            removeEntity(relevantId);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            onClick={handleOutsideClick}
        >
            <div className="bg-white dark:bg-black shadow-lg p-4 border border-gray-500 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Report Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 transition duration-200"
                    >
                        <CloseRoundedIcon
                            sx={{
                                fontSize: { xs: 25, sm: 28, md: 30 },
                            }}
                        />
                    </button>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 shadow-sm rounded-md max-h-60 overflow-y-auto hide-scrollbar">
                    {!isLoading && reportDetails.length > 0 && (
                        <>
                            {reportDetails.map((reportDetail, index) => (
                                <ReportDetail key={index} reportDetail={reportDetail} type={type} relevantId={relevantId} />
                            ))}
                        </>
                    )}
                </div>
                {isLoading && (<div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-2 w-full transition-all duration-300 ease-in-out">
                    <p className="font-medium text-gray-700 dark:text-gray-300 text-center">
                        loading
                    </p>
                </div>)}
                {error && <p className="font-semibold text-red-500 text-sm">{error}</p>}

                {!isDeleting && reportDetails.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={openDeleteModal}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium text-white transition duration-200"
                        >
                            Delete All Reports
                        </button>
                    </div>
                )}

            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                closeModal={closeDeleteModal}
                confirmDelete={confirmDelete}
                isDeleting={isDeleting}
                type="REPORTS"
            />

        </div>
    );
};

ReportDetailsModel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    relevantId: PropTypes.string.isRequired,
    removeEntity: PropTypes.func.isRequired,
};

export default ReportDetailsModel;
