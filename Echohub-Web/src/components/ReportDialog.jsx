import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axiosInstance from "../utils/axiosConfig";

const ReportDialog = ({ postId, onClose, isOpen, setIsReported }) => {
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reasons = [
    {
      value: "HARASSMENT_BULLYING",
      label: "Harassment or Bullying",
    },
    {
      value: "HATE_SPEECH",
      label: "Hate Speech",
    },
    {
      value: "SPAM",
      label: "Spam",
    },
    {
      value: "NUDITY",
      label: "Nudity or Sexual Content",
    },
    {
      value: "VIOLENCE_THREATS",
      label: "Violence or Threats",
    },
    {
      value: "SELF_HARM_SUICIDE",
      label: "Self-Harm or Suicide",
    },
    {
      value: "MISINFORMATION",
      label: "Misinformation",
    },
    {
      value: "IMPERSONATION",
      label: "Impersonation",
    },
    {
      value: "INTELLECTUAL_PROPERTY",
      label: "Intellectual Property Violations",
    },
    {
      value: "INAPPROPRIATE_CONTENT",
      label: "Inappropriate Content",
    },
    {
      value: "SCAMS_FRAUD",
      label: "Scams or Fraud",
    },
    {
      value: "ILLEGAL_ACTIVITIES",
      label: "Illegal Activities",
    },
  ];

  const handleReportReasonChange = (e) => {
    setReportReason(e.target.value);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/report`, { postId, reason: reportReason });
      setIsReported(true);
      onClose();
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className="modal" open={isOpen}>
      <div
        className="modal-box border border-gray-500 rounded-lg max-w-md md:max-w-2xl mx-auto p-6"
        style={{ maxHeight: "75vh", display: "flex", flexDirection: "column" }}
      >
        <h3 className="font-bold text-lg mb-4">Report Post</h3>
        <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((reason) => (
            <label
              key={reason.value}
              className="flex items-center group relative p-2 border rounded-md hover:bg-gray-100 transition hover:text-black"
            >
              <input
                type="radio"
                value={reason.value}
                checked={reportReason === reason.value}
                onChange={handleReportReasonChange}
                className="mr-2"
                required
              />
              {reason.label}
            </label>
          ))}
          <button
            type="submit"
            className="mt-4 btn btn-primary col-span-1 md:col-span-2 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Reporting..." : "Report"}
          </button>
          {error && <p className="text-red-500 mt-2 text-center col-span-1 md:col-span-2">{error}</p>}
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none" onClick={onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
};

ReportDialog.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsReported: PropTypes.func.isRequired,
};

export default ReportDialog;