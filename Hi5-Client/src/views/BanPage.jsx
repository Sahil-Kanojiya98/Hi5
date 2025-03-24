import { Block } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const BanPage = () => {
    const [banData, setBanData] = useState(null);

    useEffect(() => {
        const storedBanData = sessionStorage.getItem("banData");
        if (storedBanData) {
            const parsedData = JSON.parse(storedBanData);
            console.log(parsedData)
            setBanData(parsedData);

            if (!parsedData || !parsedData?.isBanned) {
                return <Navigate to="/login" />;
            }

            sessionStorage.removeItem("banData");
        }
    }, []);


    return (
        <div className="flex justify-center items-center bg-red-50 h-screen">
            <div className="bg-white shadow-lg p-8 rounded-2xl max-w-md text-center">
                <Block className="mb-4 text-red-500" style={{ fontSize: 48 }} />
                <h1 className="mb-2 font-semibold text-red-600 text-3xl">Account Banned</h1>
                <p className="mb-4 text-gray-700">
                    Your account is banned
                    {
                        banData?.banUntil &&
                        ` until ${new Date(banData?.banUntil).toLocaleDateString("en-GB")}`
                    }
                </p>
                <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-red-500 hover:bg-red-700 shadow-md mt-4 px-4 py-2 rounded-2xl font-bold text-white transition-all duration-200"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default BanPage;
