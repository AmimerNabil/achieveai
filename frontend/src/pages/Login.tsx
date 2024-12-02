import { QrCode } from "lucide-react";
import { auth, gp } from "../firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const user = auth.currentUser
        if (user) {
            navigate('/')
        }

    }, [navigate]);

    const handleLoginClick = async () => {
        try {
            await signInWithPopup(auth, gp)
            navigate('/')
        } catch (e) {
            console.error("Error during sign-in:", e);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-12">
                < h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" >
                    organizing has never been easier
                    < br />
                    <span className="text-blue-600">with AchieveAI</span>
                </h1 >
            </div >
            <button onClick={handleLoginClick} className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <QrCode className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                <span className="text-gray-700 font-medium">Sign in with Google Authenticator</span>
            </button>
        </div >
    );
}
